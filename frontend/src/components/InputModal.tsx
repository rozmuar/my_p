import { useState } from 'react';
import { X } from 'lucide-react';
import { t } from '@/i18n/russian';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  title: string;
  placeholder: string;
  defaultValue?: string;
}

const InputModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  placeholder,
  defaultValue = '',
}: ModalProps) => {
  const [name, setName] = useState(defaultValue);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t.nameRequired);
      return;
    }
    onConfirm(name.trim());
    setName('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setName(defaultValue);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder={placeholder}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
            >
              {t.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputModal;