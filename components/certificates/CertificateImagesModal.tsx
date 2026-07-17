'use client'

import { useEffect, useState } from 'react'
import { X, Star, Trash2, Upload, ImagePlus } from 'lucide-react'
import toast from 'react-hot-toast'

interface CertImage {
  id: string
  image_url: string
  is_primary: boolean
  sort_order: number
}

interface Props {
  certificateId: string | null
  certificateName: string
  onClose: () => void
  onPrimaryChange?: (imageUrl: string | null) => void
}

export default function CertificateImagesModal({
  certificateId,
  certificateName,
  onClose,
  onPrimaryChange,
}: Props) {
  const [images, setImages] = useState<CertImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    if (certificateId) fetchImages(certificateId)
  }, [certificateId])

  const fetchImages = async (id: string) => {
    setLoading(true)
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/admin/certificates/${id}/images`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) setImages(data.data)
    } catch {
      toast.error('Could not load images')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files.length || !certificateId) return

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is over 10MB`)
        e.target.value = ''
        return
      }
    }

    const token = localStorage.getItem('admin_token')
    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((f) => formData.append('files', f))

      const res = await fetch(`/api/admin/certificates/${certificateId}/images`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        await fetchImages(certificateId)
        const primary = data.data.find((img: CertImage) => img.is_primary)
        if (primary) onPrimaryChange?.(primary.image_url)
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const setPrimary = async (imageId: string) => {
    if (!certificateId) return
    setBusyId(imageId)
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(`/api/admin/certificates/${certificateId}/images`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imageId }),
      })
      const data = await res.json()
      if (data.success) {
        setImages((prev) => prev.map((img) => ({ ...img, is_primary: img.id === imageId })))
        onPrimaryChange?.(data.data.image_url)
        toast.success('Primary image updated')
      } else {
        toast.error(data.error || 'Failed to update')
      }
    } finally {
      setBusyId(null)
    }
  }

  const deleteImage = async (imageId: string) => {
    if (!certificateId) return
    if (!window.confirm('Delete this image?')) return
    setBusyId(imageId)
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch(
        `/api/admin/certificates/${certificateId}/images?imageId=${imageId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await res.json()
      if (data.success) {
        const remaining = images.filter((img) => img.id !== imageId)
        setImages(remaining)
        const wasDeletedPrimary = images.find((img) => img.id === imageId)?.is_primary
        if (wasDeletedPrimary) {
          onPrimaryChange?.(remaining[0]?.image_url ?? null)
        }
        toast.success('Image deleted')
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } finally {
      setBusyId(null)
    }
  }

  if (!certificateId) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1000, backdropFilter: 'blur(3px)' }}
      />
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '92%', maxWidth: '620px', maxHeight: '82vh',
          backgroundColor: '#ffffff', borderRadius: '18px', zIndex: 1001,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 24px', borderBottom: '1px solid #F0EBE3' }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Manage Images</p>
            <p style={{ fontSize: '12px', color: '#6B6B6B', margin: '2px 0 0' }}>{certificateName}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Upload zone */}
          <label
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '24px', borderRadius: '12px',
              border: '1.5px dashed #C1622A', backgroundColor: '#FFF8F3',
              cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1,
              marginBottom: '20px',
            }}
          >
            {uploading ? (
              <Upload size={22} color="#C1622A" className="cim-spin" />
            ) : (
              <ImagePlus size={22} color="#C1622A" />
            )}
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#C1622A' }}>
              {uploading ? 'Uploading…' : 'Click to upload images (multiple allowed)'}
            </span>
            <span style={{ fontSize: '11px', color: '#9c7a6a' }}>JPG, PNG or WEBP · up to 10MB each</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={uploading}
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          </label>

          {/* Grid */}
          {loading ? (
            <p style={{ textAlign: 'center', color: '#6B6B6B', fontSize: '13px', padding: '24px 0' }}>Loading…</p>
          ) : images.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9c7a6a', fontSize: '13px', padding: '24px 0' }}>No images yet</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
              {images.map((img) => (
                <div
                  key={img.id}
                  style={{
                    position: 'relative', borderRadius: '10px', overflow: 'hidden',
                    border: img.is_primary ? '2px solid #C1622A' : '1px solid #E8E0D8',
                    aspectRatio: '1', opacity: busyId === img.id ? 0.5 : 1,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                  {img.is_primary && (
                    <div style={{
                      position: 'absolute', top: '6px', left: '6px',
                      backgroundColor: '#C1622A', color: '#fff', fontSize: '10px', fontWeight: 700,
                      padding: '3px 8px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '3px',
                    }}>
                      <Star size={10} fill="#fff" /> Primary
                    </div>
                  )}

                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    display: 'flex', gap: '4px', padding: '6px',
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.6), transparent)',
                  }}>
                    {!img.is_primary && (
                      <button
                        onClick={() => setPrimary(img.id)}
                        disabled={busyId === img.id}
                        title="Set as primary"
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '5px', borderRadius: '6px', border: 'none',
                          backgroundColor: 'rgba(255,255,255,0.9)', cursor: 'pointer',
                        }}
                      >
                        <Star size={12} color="#1A1A1A" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteImage(img.id)}
                      disabled={busyId === img.id}
                      title="Delete"
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '5px', borderRadius: '6px', border: 'none',
                        backgroundColor: 'rgba(255,255,255,0.9)', cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={12} color="#DC2626" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cim-spin { animation: cimSpin 1s linear infinite; }
        @keyframes cimSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}