import { useState } from 'react';

export const useMediaUpload = () => {
  const [loading, setLoading] = useState(false);

  const upload = async (file: File | null, callback: (result: string) => void, type: 'image' | 'video' = 'image') => {
    if (!file) return;
    setLoading(true);
    
    const limit = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // Increased limits: 50MB video, 5MB image
    
    if (file.size > limit) {
      setLoading(false);
      alert(`Filen er for stor! Maks ${limit/(1024*1024)}MB.`);
      return; 
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const ltik = new URLSearchParams(window.location.search).get('ltik') || sessionStorage.getItem('ltik');
      const headers: Record<string, string> = {};
      if (ltik) {
        headers['Authorization'] = `Bearer ${ltik}`;
      }
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      callback(data.url);
    } catch (error) {
      console.error(error);
      alert("Feil ved opplasting.");
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading };
};