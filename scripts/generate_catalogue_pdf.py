import os
import io
import requests
from PIL import Image as PILImage
from supabase import create_client

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Supabase Credentials
SUPABASE_URL = "https://wshdktvteuyjhrozviun.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzaGRrdHZ0ZXV5amhyb3p2aXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNzUzMDgsImV4cCI6MjA5NjY1MTMwOH0.CjDU7Sf4Jfe_kcJNM1Su380aJcfFH2mvsTK6xiMynWo"

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_PDF_PATH = os.path.join(PROJECT_ROOT, "public", "catalogue.pdf")
CACHE_DIR = os.path.join(PROJECT_ROOT, "scratch", "img_cache")
os.makedirs(CACHE_DIR, exist_ok=True)

# Brand Palette
PRIMARY_SAFFRON = colors.HexColor('#C1622A')
DEEP_INK = colors.HexColor('#1A1A1A')
CREAM_BG = colors.HexColor('#FDFBF7')
WARM_BORDER = colors.HexColor('#E8E0D8')
TEXT_MUTED = colors.HexColor('#5C5850')
CARD_BG = colors.HexColor('#FAFAF7')
GOLD_BADGE = colors.HexColor('#FFF8F0')

def download_image(url, product_id):
    if not url:
        return None
    
    jpg_path = os.path.join(CACHE_DIR, f"{product_id}.jpg")
    if os.path.exists(jpg_path):
        return jpg_path
    
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            img = PILImage.open(io.BytesIO(resp.content))
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            img.save(jpg_path, 'JPEG', quality=85)
            return jpg_path
    except Exception as e:
        print(f"Error downloading image for {product_id}: {e}")
    return None

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return
        
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(TEXT_MUTED)
        
        # Header
        self.setStrokeColor(WARM_BORDER)
        self.setLineWidth(0.5)
        self.line(36, A4[1] - 36, A4[0] - 36, A4[1] - 36)
        self.drawString(36, A4[1] - 30, "AACHARI INTERNATIONAL EXIM — EXPORT PRODUCT CATALOGUE")
        self.drawRightString(A4[0] - 36, A4[1] - 30, "aachariexim.com")
        
        # Footer
        self.line(36, 45, A4[0] - 36, 45)
        self.drawString(36, 32, "Confidential & Proprietary | Premium Export Quality")
        self.drawRightString(A4[0] - 36, 32, f"Page {self._pageNumber} of {page_count}")
        
        self.restoreState()

def generate_pdf():
    print("Fetching product & category data from Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    categories_res = supabase.from_('categories').select('*').eq('is_active', True).order('sort_order').execute()
    categories = categories_res.data or []
    
    products_res = supabase.from_('products').select('*, category:categories(*), images:product_images(*), specs:product_specs(*)').eq('is_active', True).order('sort_order').execute()
    products = products_res.data or []
    
    print(f"Loaded {len(categories)} categories and {len(products)} products.")

    cat_map = {}
    for c in categories:
        cat_map[c['id']] = {'info': c, 'products': []}
    
    for p in products:
        c_id = p.get('category_id')
        if c_id in cat_map:
            cat_map[c_id]['products'].append(p)

    doc = SimpleDocTemplate(
        OUTPUT_PDF_PATH,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=48,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle('CoverTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=28, leading=34, textColor=DEEP_INK)
    subtitle_style = ParagraphStyle('CoverSubtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=13, leading=18, textColor=PRIMARY_SAFFRON)
    cat_heading_style = ParagraphStyle('CatHeading', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=18, leading=22, textColor=PRIMARY_SAFFRON, spaceBefore=12, spaceAfter=8)
    prod_title_style = ParagraphStyle('ProdTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=13, leading=16, textColor=DEEP_INK)
    meta_badge_style = ParagraphStyle('MetaBadge', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=PRIMARY_SAFFRON)
    body_desc_style = ParagraphStyle('BodyDesc', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12, textColor=TEXT_MUTED)
    spec_key_style = ParagraphStyle('SpecKey', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=DEEP_INK)
    spec_val_style = ParagraphStyle('SpecVal', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=10, textColor=TEXT_MUTED)

    story = []

    # COVER PAGE
    story.append(Spacer(1, 20))
    brand_bar = Table(
        [[Paragraph("<b>AACHARI INTERNATIONAL EXIM</b>", ParagraphStyle('B1', fontName='Helvetica-Bold', fontSize=12, textColor=colors.white)),
          Paragraph("Merchant Exporters | Tamil Nadu, India", ParagraphStyle('B2', fontName='Helvetica', fontSize=10, textColor=colors.white, alignment=2))]],
        colWidths=[300, 223]
    )
    brand_bar.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), PRIMARY_SAFFRON),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(brand_bar)
    story.append(Spacer(1, 40))

    story.append(Paragraph("EXPORT PRODUCT<br/>CATALOGUE", title_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph("<i>Bridging India’s Commercial Heritage with Emerging Global Frontiers</i>", subtitle_style))
    story.append(Spacer(1, 24))
    story.append(HRFlowable(width="100%", thickness=2, color=PRIMARY_SAFFRON, spaceBefore=0, spaceAfter=24))

    overview_text = """
    <b>Welcome to Aachari International Exim</b><br/><br/>
    We are a premier Indian Merchant Exporter specializing in high-grade Agricultural Produce, Premium Rice Varieties, Authentic Handicrafts, and Fine Textiles & Linen. 
    Every product in this catalogue is processed, inspected, and packaged in strict compliance with international quality standards, ensuring maximum purity, freshness, and global compliance.<br/><br/>
    <b>Catalogue Scope:</b><br/>
    • <b>Total Listed Products:</b> 40 Export Commodities<br/>
    • <b>Major Categories:</b> Agro Products, Rice Products, Handicrafts, Textiles & Linen<br/>
    • <b>Full Specifications Included:</b> Verified HSN Codes, Product Slugs, Primary Images & Quality Standards
    """
    
    overview_table = Table([[Paragraph(overview_text, ParagraphStyle('O1', fontName='Helvetica', fontSize=10, leading=15, textColor=DEEP_INK))]], colWidths=[523])
    overview_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), GOLD_BADGE),
        ('BOX', (0,0), (-1,-1), 1, WARM_BORDER),
        ('PADDING', (0,0), (-1,-1), 16),
    ]))
    story.append(overview_table)
    story.append(Spacer(1, 60))

    contact_box_data = [
        [Paragraph("<b>OFFICIAL CONTACT & INQUIRIES</b>", ParagraphStyle('CBH', fontName='Helvetica-Bold', fontSize=10, textColor=PRIMARY_SAFFRON)),
         Paragraph("<b>GLOBAL EXPORT HEADQUARTERS</b>", ParagraphStyle('CBH2', fontName='Helvetica-Bold', fontSize=10, textColor=PRIMARY_SAFFRON))],
        [Paragraph("Email: <b>info@aachariexim.com</b><br/>Web: <b>www.aachariexim.com</b><br/>Direct: <b>aachariexim@gmail.com</b>", ParagraphStyle('CBT', fontName='Helvetica', fontSize=9, leading=14, textColor=DEEP_INK)),
         Paragraph("Aachari International Exim<br/>Tamil Nadu, India<br/>Port Locations: Chennai, Tuticorin, Nhava Sheva", ParagraphStyle('CBT2', fontName='Helvetica', fontSize=9, leading=14, textColor=DEEP_INK))]
    ]
    contact_table = Table(contact_box_data, colWidths=[260, 263])
    contact_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, WARM_BORDER),
        ('PADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(contact_table)
    story.append(PageBreak())

    # TABLE OF CONTENTS
    story.append(Paragraph("TABLE OF CONTENTS", cat_heading_style))
    story.append(HRFlowable(width="100%", thickness=1, color=WARM_BORDER, spaceBefore=4, spaceAfter=16))

    toc_rows = [
        [Paragraph("<b>Category Name</b>", ParagraphStyle('TH1', fontName='Helvetica-Bold', fontSize=10, textColor=DEEP_INK)),
         Paragraph("<b>Product Count</b>", ParagraphStyle('TH2', fontName='Helvetica-Bold', fontSize=10, textColor=DEEP_INK, alignment=1)),
         Paragraph("<b>Key Export Commodities</b>", ParagraphStyle('TH3', fontName='Helvetica-Bold', fontSize=10, textColor=DEEP_INK))]
    ]

    for c_id, c_data in cat_map.items():
        c_info = c_data['info']
        c_prods = c_data['products']
        sample_names = ", ".join([p['name'] for p in c_prods[:3]])
        if len(c_prods) > 3:
            sample_names += f" (+{len(c_prods)-3} more)"
        
        toc_rows.append([
            Paragraph(f"<b>{c_info['name']}</b>", ParagraphStyle('TD1', fontName='Helvetica-Bold', fontSize=10, textColor=PRIMARY_SAFFRON)),
            Paragraph(str(len(c_prods)), ParagraphStyle('TD2', fontName='Helvetica', fontSize=10, textColor=DEEP_INK, alignment=1)),
            Paragraph(sample_names, ParagraphStyle('TD3', fontName='Helvetica', fontSize=9, textColor=TEXT_MUTED))
        ])

    toc_table = Table(toc_rows, colWidths=[150, 80, 293])
    toc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), CARD_BG),
        ('GRID', (0,0), (-1,-1), 0.5, WARM_BORDER),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(toc_table)
    story.append(Spacer(1, 24))

    quality_box = Table(
        [[Paragraph("<b>COMPLIANCE & QUALITY GUARANTEE</b><br/><br/>"
                    "All food and agricultural items exported by Aachari International Exim undergo mandatory phytosanitary inspections, laboratory testing for purity, and custom export-compliant moisture-resistant packaging. HSN codes provided in this catalogue correspond to the latest Indian Customs Harmonized System Tariff.", 
                    ParagraphStyle('QB', fontName='Helvetica', fontSize=9, leading=13, textColor=DEEP_INK))]],
        colWidths=[523]
    )
    quality_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), GOLD_BADGE),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY_SAFFRON),
        ('PADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(quality_box)
    story.append(PageBreak())

    # PRODUCT PAGES
    for c_id, c_data in cat_map.items():
        c_info = c_data['info']
        c_prods = c_data['products']
        if not c_prods:
            continue

        story.append(Paragraph(f"CATEGORY: {c_info['name'].upper()}", cat_heading_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY_SAFFRON, spaceBefore=2, spaceAfter=14))

        for p in c_prods:
            p_name = p.get('name', 'Product Name')
            p_slug = p.get('slug', '')
            p_hsn = p.get('hsn_code') or 'N/A'
            p_desc = p.get('short_description') or p.get('description') or 'Premium export-quality product sourced and verified directly from top production hubs in South India.'
            
            images = p.get('images', [])
            primary_url = None
            for img in images:
                if img.get('is_primary'):
                    primary_url = img.get('image_url')
                    break
            if not primary_url and images:
                primary_url = images[0].get('image_url')

            local_img_path = download_image(primary_url, p['id']) if primary_url else None
            
            if local_img_path and os.path.exists(local_img_path):
                try:
                    img_flowable = RLImage(local_img_path, width=1.6*inch, height=1.3*inch)
                except Exception:
                    img_flowable = Paragraph("<font color='#888888'>[Image Unavailable]</font>", body_desc_style)
            else:
                img_flowable = Paragraph("<font color='#888888'>[No Image]</font>", body_desc_style)

            detail_content = []
            detail_content.append(Paragraph(f"<b>{p_name}</b>", prod_title_style))
            detail_content.append(Spacer(1, 4))
            
            badge_table_data = [[
                Paragraph(f"<b>HSN:</b> {p_hsn}", meta_badge_style),
                Paragraph(f"<b>REF SLUG:</b> {p_slug}", meta_badge_style)
            ]]
            badge_table = Table(badge_table_data, colWidths=[120, 220])
            badge_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), GOLD_BADGE),
                ('BOX', (0,0), (-1,-1), 0.5, WARM_BORDER),
                ('PADDING', (0,0), (-1,-1), 4),
                ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ]))
            detail_content.append(badge_table)
            detail_content.append(Spacer(1, 6))

            detail_content.append(Paragraph(p_desc, body_desc_style))
            detail_content.append(Spacer(1, 6))

            specs = p.get('specs', [])
            if specs:
                spec_rows = []
                for s in specs[:3]:
                    key = s.get('spec_key', '')
                    val = s.get('spec_value', '')
                    if key and val:
                        spec_rows.append([
                            Paragraph(f"• {key}:", spec_key_style),
                            Paragraph(val, spec_val_style)
                        ])
                if spec_rows:
                    spec_table = Table(spec_rows, colWidths=[100, 240])
                    spec_table.setStyle(TableStyle([
                        ('PADDING', (0,0), (-1,-1), 1),
                        ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ]))
                    detail_content.append(spec_table)

            card_table = Table([[img_flowable, detail_content]], colWidths=[130, 383])
            card_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
                ('BOX', (0,0), (-1,-1), 1, WARM_BORDER),
                ('PADDING', (0,0), (-1,-1), 10),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('ALIGN', (0,0), (0,0), 'CENTER'),
            ]))

            story.append(KeepTogether([card_table, Spacer(1, 10)]))

        story.append(Spacer(1, 14))

    # BACK COVER PAGE
    story.append(PageBreak())
    story.append(Spacer(1, 40))

    end_title = ParagraphStyle('EndTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=24, leading=28, textColor=PRIMARY_SAFFRON, alignment=1)
    end_sub = ParagraphStyle('EndSub', parent=styles['Normal'], fontName='Helvetica', fontSize=12, leading=16, textColor=DEEP_INK, alignment=1)

    story.append(Paragraph("PARTNER WITH AACHAARI INTERNATIONAL EXIM", end_title))
    story.append(Spacer(1, 10))
    story.append(Paragraph("Your Trusted Trade Partner for Premium Indian Products Worldwide", end_sub))
    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="60%", thickness=2, color=PRIMARY_SAFFRON, spaceBefore=0, spaceAfter=30))

    final_box_data = [
        [Paragraph("<b>MANAGEMENT & LEADERSHIP</b>", ParagraphStyle('FMH', fontName='Helvetica-Bold', fontSize=11, textColor=PRIMARY_SAFFRON)),
         Paragraph("<b>BUSINESS ENQUIRIES</b>", ParagraphStyle('FMH2', fontName='Helvetica-Bold', fontSize=11, textColor=PRIMARY_SAFFRON))],
        [Paragraph("• <b>Hariharan P</b><br/>  Managing Director", ParagraphStyle('FMC1', fontName='Helvetica', fontSize=10, leading=15, textColor=DEEP_INK)),
         Paragraph("<b>Email:</b> info@aachariexim.com<br/><b>Secondary Email:</b> aachariexim@gmail.com<br/><b>Website:</b> https://aachariexim.com<br/><b>Port Base:</b> Chennai Port / Tuticorin Port<br/><b>Origin:</b> Tamil Nadu, India", ParagraphStyle('FMC2', fontName='Helvetica', fontSize=10, leading=15, textColor=DEEP_INK))]
    ]

    final_table = Table(final_box_data, colWidths=[250, 273])
    final_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1.5, PRIMARY_SAFFRON),
        ('PADDING', (0,0), (-1,-1), 16),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(final_table)
    story.append(Spacer(1, 40))

    thank_text = Paragraph(
        "Thank you for reviewing our export product catalogue.<br/>"
        "For custom specifications, private labeling, container pricing, or sample requests, please reach out to <b>info@aachariexim.com</b>.",
        ParagraphStyle('TT', fontName='Helvetica', fontSize=10, leading=15, textColor=TEXT_MUTED, alignment=1)
    )
    story.append(thank_text)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Catalogue PDF successfully saved to {OUTPUT_PDF_PATH}")

if __name__ == '__main__':
    generate_pdf()
