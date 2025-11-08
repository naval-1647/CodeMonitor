import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Copy, Check } from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Snippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    language: 'python',
    description: '',
    tags: '',
  });

  useEffect(() => {
    loadSnippets();
  }, [searchQuery]);

  const loadSnippets = async () => {
    try {
      const url = searchQuery
        ? `/api/snippets?search=${encodeURIComponent(searchQuery)}`
        : '/api/snippets';
      const response = await api.get(url);
      setSnippets(response.data.data);
    } catch (error) {
      console.error('Error loading snippets:', error);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (selectedSnippet) {
        await api.put(`/api/snippets/${selectedSnippet.id}`, payload);
      } else {
        await api.post('/api/snippets', payload);
      }
      
      setShowModal(false);
      setSelectedSnippet(null);
      setFormData({ title: '', code: '', language: 'python', description: '', tags: '' });
      loadSnippets();
    } catch (error) {
      console.error('Error saving snippet:', error);
      alert('Failed to save snippet');
    }
  };

  const handleEdit = (snippet) => {
    setSelectedSnippet(snippet);
    setFormData({
      title: snippet.title,
      code: snippet.code,
      language: snippet.language,
      description: snippet.description || '',
      tags: snippet.tags.join(', '),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this snippet?')) return;

    try {
      await api.delete(`/api/snippets/${id}`);
      loadSnippets();
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  };

  const copyToClipboard = async (code, id) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Snippets
          </h1>
          <button
            onClick={() => {
              setSelectedSnippet(null);
              setFormData({ title: '', code: '', language: 'python', description: '', tags: '' });
              setShowModal(true);
            }}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Snippet</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet) => (
            <div key={snippet.id} className="card p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {snippet.title}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">
                    {snippet.language}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => copyToClipboard(snippet.code, snippet.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Copy code"
                  >
                    {copiedId === snippet.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(snippet)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(snippet.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              {snippet.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {snippet.description}
                </p>
              )}

              <div className="bg-gray-900 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <SyntaxHighlighter
                  language={snippet.language}
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, fontSize: '0.75rem' }}
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </div>

              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {snippet.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                {new Date(snippet.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {snippets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No snippets found. Create your first snippet!
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {selectedSnippet ? 'Edit Snippet' : 'New Snippet'}
            </h2>
            
            <form onSubmit={handleCreateOrUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Language
                </label>
                <select
                  className="input"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="typescript">TypeScript</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Code
                </label>
                <textarea
                  required
                  rows={10}
                  className="input font-mono text-sm"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="algorithm, sorting, data-structures"
                />
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn btn-primary flex-1">
                  {selectedSnippet ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Snippets;
