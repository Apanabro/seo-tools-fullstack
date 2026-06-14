import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

const schemaTypes = [
  { value: 'article', label: 'Article', fields: ['headline', 'author', 'datePublished', 'dateModified', 'image', 'description'] },
  { value: 'product', label: 'Product', fields: ['name', 'description', 'image', 'brand', 'price', 'priceCurrency', 'availability'] },
  { value: 'localbusiness', label: 'Local Business', fields: ['name', 'description', 'address', 'telephone', 'openingHours', 'geo'] },
  { value: 'organization', label: 'Organization', fields: ['name', 'url', 'logo', 'contactPoint', 'sameAs'] },
  { value: 'person', label: 'Person', fields: ['name', 'url', 'image', 'jobTitle', 'worksFor'] },
  { value: 'event', label: 'Event', fields: ['name', 'description', 'startDate', 'endDate', 'location', 'organizer'] },
  { value: 'faq', label: 'FAQ Page', fields: ['questions'] },
  { value: 'breadcrumb', label: 'BreadcrumbList', fields: ['items'] },
  { value: 'recipe', label: 'Recipe', fields: ['name', 'description', 'image', 'cookTime', 'recipeIngredient', 'recipeInstructions'] },
  { value: 'video', label: 'Video', fields: ['name', 'description', 'thumbnailUrl', 'uploadDate', 'duration', 'embedUrl'] },
  { value: 'review', label: 'Review', fields: ['name', 'reviewBody', 'author', 'reviewRating', 'itemReviewed'] },
  { value: 'webpage', label: 'WebPage', fields: ['name', 'description', 'url', 'datePublished', 'dateModified'] },
];

function generateSchema(type, data) {
  const base = { '@context': 'https://schema.org', '@type': '' };

  switch(type) {
    case 'article':
      return { ...base, '@type': 'Article', headline: data.headline, author: { '@type': 'Person', name: data.author }, datePublished: data.datePublished, dateModified: data.dateModified || data.datePublished, image: data.image, description: data.description, mainEntityOfPage: { '@type': 'WebPage', '@id': data.url || '' } };
    case 'product':
      return { ...base, '@type': 'Product', name: data.name, description: data.description, image: data.image, brand: { '@type': 'Brand', name: data.brand }, offers: { '@type': 'Offer', price: data.price, priceCurrency: data.priceCurrency || 'USD', availability: `https://schema.org/${data.availability || 'InStock'}` } };
    case 'localbusiness':
      return { ...base, '@type': 'LocalBusiness', name: data.name, description: data.description, address: { '@type': 'PostalAddress', streetAddress: data.address }, telephone: data.telephone, openingHours: data.openingHours, geo: { '@type': 'GeoCoordinates', latitude: data.latitude || '', longitude: data.longitude || '' } };
    case 'organization':
      return { ...base, '@type': 'Organization', name: data.name, url: data.url, logo: data.logo, contactPoint: { '@type': 'ContactPoint', telephone: data.telephone, contactType: 'customer service' }, sameAs: (data.sameAs || '').split('\n').filter(Boolean) };
    case 'person':
      return { ...base, '@type': 'Person', name: data.name, url: data.url, image: data.image, jobTitle: data.jobTitle, worksFor: { '@type': 'Organization', name: data.worksFor } };
    case 'event':
      return { ...base, '@type': 'Event', name: data.name, description: data.description, startDate: data.startDate, endDate: data.endDate, location: { '@type': 'Place', name: data.location }, organizer: { '@type': 'Organization', name: data.organizer } };
    case 'faq':
      const questions = (data.questions || '').split('\n').filter(Boolean);
      return { ...base, '@type': 'FAQPage', mainEntity: questions.map(q => ({ '@type': 'Question', name: q.split('|')[0] || q, acceptedAnswer: { '@type': 'Answer', text: q.split('|')[1] || '' } })) };
    case 'breadcrumb':
      const items = (data.items || '').split('\n').filter(Boolean);
      return { ...base, '@type': 'BreadcrumbList', itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.split('|')[0] || item, item: item.split('|')[1] || '' })) };
    case 'recipe':
      return { ...base, '@type': 'Recipe', name: data.name, description: data.description, image: data.image, cookTime: data.cookTime, recipeIngredient: (data.recipeIngredient || '').split('\n').filter(Boolean), recipeInstructions: (data.recipeInstructions || '').split('\n').filter(Boolean).map(s => ({ '@type': 'HowToStep', text: s })) };
    case 'video':
      return { ...base, '@type': 'VideoObject', name: data.name, description: data.description, thumbnailUrl: data.thumbnailUrl, uploadDate: data.uploadDate, duration: data.duration, embedUrl: data.embedUrl };
    case 'review':
      return { ...base, '@type': 'Review', name: data.name, reviewBody: data.reviewBody, author: { '@type': 'Person', name: data.author }, reviewRating: { '@type': 'Rating', ratingValue: data.reviewRating || '5', bestRating: '5' }, itemReviewed: { '@type': 'Product', name: data.itemReviewed } };
    case 'webpage':
      return { ...base, '@type': 'WebPage', name: data.name, description: data.description, url: data.url, datePublished: data.datePublished, dateModified: data.dateModified };
    default:
      return base;
  }
}

const SchemaGenerator = () => {
  const [schemaType, setSchemaType] = useState('article');
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);

  const currentType = schemaTypes.find(t => t.value === schemaType);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const schema = generateSchema(schemaType, formData);
    setResult(schema);
  };

  const copyToClipboard = () => { navigator.clipboard.writeText(JSON.stringify(result, null, 2)); };

  const downloadSchema = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `schema-${schemaType}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const fieldLabels = {
    headline: 'Headline', author: 'Author Name', datePublished: 'Date Published (YYYY-MM-DD)', dateModified: 'Date Modified (YYYY-MM-DD)',
    image: 'Image URL', description: 'Description', url: 'URL', name: 'Name', brand: 'Brand Name', price: 'Price',
    priceCurrency: 'Currency (USD, EUR)', availability: 'Availability (InStock, OutOfStock)', address: 'Street Address',
    telephone: 'Phone Number', openingHours: 'Opening Hours (Mo-Fr 09:00-17:00)', latitude: 'Latitude', longitude: 'Longitude',
    logo: 'Logo URL', sameAs: 'Social Media URLs (one per line)', jobTitle: 'Job Title', worksFor: 'Company Name',
    startDate: 'Start Date (YYYY-MM-DDTHH:MM)', endDate: 'End Date (YYYY-MM-DDTHH:MM)', location: 'Location Name',
    organizer: 'Organizer Name', questions: 'Questions (Question|Answer per line)', items: 'Items (Name|URL per line)',
    cookTime: 'Cook Time (PT30M)', recipeIngredient: 'Ingredients (one per line)', recipeInstructions: 'Instructions (one per line)',
    thumbnailUrl: 'Thumbnail URL', uploadDate: 'Upload Date (YYYY-MM-DD)', duration: 'Duration (PT1M30S)', embedUrl: 'Embed URL',
    reviewBody: 'Review Text', reviewRating: 'Rating (1-5)', itemReviewed: 'Item Name'
  };

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="schemaGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00bcd4" /><stop offset="100%" stopColor="#4285f4" /></linearGradient></defs>
            <path fill="url(#schemaGrad)" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
        </div>
        <h1>Schema Markup Generator</h1>
        <p>Generate JSON-LD structured data for better search engine understanding.</p>
      </div>

      <div className="tool-content">
        <form onSubmit={handleSubmit} className="tool-form">
          <div className="form-group">
            <label htmlFor="schemaType">Schema Type</label>
            <select id="schemaType" value={schemaType} onChange={(e) => { setSchemaType(e.target.value); setFormData({}); setResult(null); }}>
              {schemaTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {currentType.fields.map(field => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{fieldLabels[field] || field}</label>
              {field === 'questions' || field === 'items' || field === 'sameAs' || field === 'recipeIngredient' || field === 'recipeInstructions' ? (
                <textarea id={field} rows={4} placeholder={field === 'questions' ? 'What is SEO?|SEO stands for Search Engine Optimization...' : 'Home|https://example.com/'} value={formData[field] || ''} onChange={(e) => handleChange(field, e.target.value)} />
              ) : field === 'availability' ? (
                <select id={field} value={formData[field] || 'InStock'} onChange={(e) => handleChange(field, e.target.value)}>
                  <option value="InStock">In Stock</option>
                  <option value="OutOfStock">Out of Stock</option>
                  <option value="PreOrder">Pre-Order</option>
                  <option value="SoldOut">Sold Out</option>
                </select>
              ) : (
                <input type={field.includes('Date') ? 'date' : field.includes('price') ? 'number' : field === 'reviewRating' ? 'number' : 'text'} id={field} placeholder={fieldLabels[field]} value={formData[field] || ''} onChange={(e) => handleChange(field, e.target.value)} />
              )}
            </div>
          ))}

          <button type="submit" className="submit-btn">Generate Schema Markup</button>
        </form>

        {result && (
          <motion.div className="result-box success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <h3>Generated JSON-LD</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={copyToClipboard} className="copy-btn">Copy JSON</button>
                <button onClick={downloadSchema} className="copy-btn" style={{ background: 'var(--google-green)' }}>Download</button>
              </div>
            </div>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            <div style={{ marginTop: 16 }}>
              <h4 style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 8 }}>HTML to paste in your page:</h4>
              <pre style={{ background: 'var(--gray-100)', padding: 12, borderRadius: 8, fontSize: 12 }}>{`<script type="application/ld+json">\n${JSON.stringify(result, null, 2)}\n</script>`}</pre>
              <button onClick={() => navigator.clipboard.writeText(`<script type="application/ld+json">\n${JSON.stringify(result, null, 2)}\n</script>`)} className="copy-btn" style={{ marginTop: 8 }}>Copy HTML Tag</button>
            </div>
          </motion.div>
        )}

        <div className="tool-info">
          <h3>Supported Schema Types</h3>
          <ul>
            <li>Article, BlogPosting, NewsArticle</li>
            <li>Product with offers and pricing</li>
            <li>LocalBusiness with address and hours</li>
            <li>Organization and Person</li>
            <li>Event with dates and location</li>
            <li>FAQ Page with questions/answers</li>
            <li>BreadcrumbList navigation</li>
            <li>Recipe with ingredients and steps</li>
            <li>Video with embed info</li>
            <li>Review with ratings</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default SchemaGenerator;
