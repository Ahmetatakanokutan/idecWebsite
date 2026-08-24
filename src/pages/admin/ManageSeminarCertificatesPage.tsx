import { useEffect, useState } from 'react';
import { Trash2, Loader2, Download, UploadCloud, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { seminarCertificateService } from '../../services/apiService';

interface SeminarCertificate {
  id: number;
  fullName: string;
}

type PendingStatus = 'pending' | 'uploading' | 'success' | 'error';

interface PendingFile {
  id: string;
  file: File;
  fullName: string;
  status: PendingStatus;
  error?: string;
}

const extractNameFromFilename = (filename: string) => {
  const base = filename.replace(/\.pdf$/i, '');
  return base
    .split(/[_\-\s]+/)
    .filter((token) => token && !/^\d+$/.test(token))
    .join(' ');
};

const ManageSeminarCertificatesPage = () => {
  const [certificates, setCertificates] = useState<SeminarCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isUploadingAll, setIsUploadingAll] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await seminarCertificateService.list();
      setCertificates(data);
    } catch (err: any) {
      console.error('Failed to fetch seminar certificates', err);
      alert(err?.message || 'Sertifikalar alınamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newEntries: PendingFile[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      file,
      fullName: extractNameFromFilename(file.name),
      status: 'pending',
    }));
    setPendingFiles((prev) => [...prev, ...newEntries]);

    // Aynı dosyaları tekrar seçebilmek için input'u sıfırla
    e.target.value = '';
  };

  const updatePendingFullName = (id: string, value: string) => {
    setPendingFiles((prev) => prev.map((p) => (p.id === id ? { ...p, fullName: value } : p)));
  };

  const removePendingFile = (id: string) => {
    setPendingFiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUploadAll = async () => {
    const toUpload = pendingFiles.filter((p) => p.status === 'pending' || p.status === 'error');
    if (toUpload.length === 0 || isUploadingAll) return;

    setIsUploadingAll(true);
    setUploadProgress({ done: 0, total: toUpload.length });

    for (const entry of toUpload) {
      if (!entry.fullName.trim()) {
        setPendingFiles((prev) =>
          prev.map((p) => (p.id === entry.id ? { ...p, status: 'error', error: 'Ad soyad boş olamaz.' } : p))
        );
        setUploadProgress((prog) => ({ ...prog, done: prog.done + 1 }));
        continue;
      }

      setPendingFiles((prev) => prev.map((p) => (p.id === entry.id ? { ...p, status: 'uploading' } : p)));

      try {
        await seminarCertificateService.upload(entry.file, entry.fullName.trim());
        setPendingFiles((prev) => prev.map((p) => (p.id === entry.id ? { ...p, status: 'success' } : p)));
      } catch (err: any) {
        setPendingFiles((prev) =>
          prev.map((p) =>
            p.id === entry.id ? { ...p, status: 'error', error: err?.message || 'Yükleme başarısız.' } : p
          )
        );
      } finally {
        setUploadProgress((prog) => ({ ...prog, done: prog.done + 1 }));
      }
    }

    setIsUploadingAll(false);
    await fetchCertificates();
    // Basarili yuklenenleri listeden temizle, hata alanlari duzeltip tekrar denemek icin birak
    setPendingFiles((prev) => prev.filter((p) => p.status !== 'success'));
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu sertifikayı silmek istediğinizden emin misiniz?')) {
      return;
    }
    try {
      await seminarCertificateService.remove(id);
      await fetchCertificates();
    } catch (err: any) {
      console.error('Failed to delete seminar certificate', err);
      alert(err?.message || 'Sertifika silinemedi. Lütfen tekrar deneyin.');
    }
  };

  const handleDownload = async (id: number, name: string) => {
    setDownloadingId(id);
    try {
      const token = localStorage.getItem('token');
      const envBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
      const baseUrl = envBaseUrl || window.location.origin;
      const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/seminar-certificates/${id}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) {
        throw new Error('İndirilemedi.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${name}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Sertifika indirilirken bir hata oluştu.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Seminer Sertifikalarını Yönet</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Yeni Sertifika Yükle</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PDF Dosyaları</label>
          <input
            id="seminar-cert-file"
            type="file"
            accept="application/pdf,.pdf"
            multiple
            onChange={handleFileChange}
            disabled={isUploadingAll}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-60"
          />
          <p className="mt-1 text-xs text-gray-500">Birden fazla PDF seçebilirsiniz. Ad soyad dosya adından otomatik çıkarılır, aşağıdan düzenleyebilirsiniz.</p>
        </div>

        {pendingFiles.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-[640px] w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosya</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">&nbsp;</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingFiles.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-4 py-2 text-sm text-gray-500 max-w-[180px] truncate" title={entry.file.name}>
                        {entry.file.name}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={entry.fullName}
                          onChange={(e) => updatePendingFullName(entry.id, e.target.value)}
                          disabled={entry.status === 'uploading' || entry.status === 'success'}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm disabled:bg-gray-50"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {entry.status === 'pending' && <span className="text-gray-400">Bekliyor</span>}
                        {entry.status === 'uploading' && (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor
                          </span>
                        )}
                        {entry.status === 'success' && (
                          <span className="inline-flex items-center gap-1 text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" /> Yüklendi
                          </span>
                        )}
                        {entry.status === 'error' && (
                          <span className="inline-flex items-center gap-1 text-red-600" title={entry.error}>
                            <AlertCircle className="w-4 h-4" /> {entry.error || 'Hata'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {entry.status !== 'uploading' && entry.status !== 'success' && (
                          <button
                            type="button"
                            onClick={() => removePendingFile(entry.id)}
                            className="text-gray-400 hover:text-red-600"
                            title="Kaldır"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            onClick={handleUploadAll}
            disabled={pendingFiles.filter((p) => p.status === 'pending' || p.status === 'error').length === 0 || isUploadingAll}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isUploadingAll ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5 mr-2" />
            )}
            {isUploadingAll ? 'Yükleniyor...' : 'Hepsini Yükle'}
          </button>
          {isUploadingAll && (
            <span className="text-sm text-gray-600">{uploadProgress.done} / {uploadProgress.total}</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span>{cert.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleDownload(cert.id, cert.fullName)}
                        disabled={downloadingId === cert.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                      >
                        {downloadingId === cert.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        İndir
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {certificates.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-10 text-center text-gray-500">
                      Henüz sertifika yüklenmemiş.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSeminarCertificatesPage;
