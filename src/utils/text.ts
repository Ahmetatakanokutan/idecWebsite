// HTML icerikli metinleri (orn. zengin metin editorunden gelen duyuru icerigi)
// duz metne cevirir. Native DOMParser kullanir, script calistirmaz.
export const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
};

export const truncate = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength).trimEnd() + '...';
};
