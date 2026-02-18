import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, Upload, ImageIcon } from 'lucide-react';
import { apiService } from '../../services/apiService';

interface Announcement {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    active: boolean;
    createdAt: string;
}

const ManageAnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        active: true
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await apiService.get('/announcements');
            setAnnouncements(data);
        } catch (error) {
            console.error("Failed to fetch announcements", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await apiService.put(`/announcements/${editingId}`, formData);
            } else {
                await apiService.post('/announcements', formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchAnnouncements();
        } catch (error) {
            console.error("Failed to save announcement", error);
            alert("Bir hata oluştu.");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
            try {
                await apiService.delete(`/announcements/${id}`);
                fetchAnnouncements();
            } catch (error) {
                console.error("Failed to delete announcement", error);
            }
        }
    };

    const handleEdit = (announcement: Announcement) => {
        setEditingId(announcement.id);
        setFormData({
            title: announcement.title,
            content: announcement.content,
            imageUrl: announcement.imageUrl || '',
            active: announcement.active
        });
        setIsModalOpen(true);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const url = await apiService.uploadFile(file);
            setFormData({ ...formData, imageUrl: url });
        } catch (error) {
            console.error("Upload failed", error);
            alert("Resim yüklenirken bir hata oluştu.");
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ title: '', content: '', imageUrl: '', active: true });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Duyuruları Yönet</h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Yeni Duyuru
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Görsel</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İçerik Özeti</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {announcements.map((announcement) => (
                                <tr key={announcement.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {announcement.imageUrl ? (
                                            <img src={announcement.imageUrl} alt={announcement.title} className="w-12 h-12 object-cover rounded" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{announcement.content}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${announcement.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {announcement.active ? 'Aktif' : 'Pasif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(announcement)} className="text-blue-600 hover:text-blue-900 mr-4">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(announcement.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">{editingId ? 'Duyuruyu Düzenle' : 'Yeni Duyuru Ekle'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">X</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duyuru Görseli</label>
                                
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder="Resim URL'si girin veya aşağıdan yükleyin..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>

                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="space-y-1 text-center">
                                        {formData.imageUrl ? (
                                            <div className="relative">
                                                <img src={formData.imageUrl} alt="Preview" className="mx-auto h-48 object-cover rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({...formData, imageUrl: ''})}
                                                    className="absolute top-2 right-2 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                {uploading ? (
                                                     <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                                                ) : (
                                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                )}
                                                <div className="flex text-sm text-gray-600 justify-center">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                                                    >
                                                        <span>Resim Yükle</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                                                    </label>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF max 5MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="active"
                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                />
                                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                                    Aktif olarak yayınla
                                </label>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    {editingId ? 'Güncelle' : 'Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAnnouncementsPage;
