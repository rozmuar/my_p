import React, { useState } from 'react';
import { X } from 'lucide-react';

interface InputModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  placeholder?: string;
  defaultValue?: string;
  fields?: Array<{
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }>;
}

const InputModal: React.FC<InputModalProps> = ({
  isOpen = true,
  onClose,
  onSubmit,
  title,
  placeholder,
  defaultValue,
  fields
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    if (fields) {
      return fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
    } else {
      return { value: defaultValue || '' };
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fields) {
      onSubmit(formData);
      setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
    } else {
      onSubmit(formData.value);
      setFormData({ value: '' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {fields ? (
            fields.map((field) => (
              <div key={field.name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))
          ) : (
            <div className="mb-4">
              <input
                type="text"
                placeholder={placeholder}
                value={formData.value || ''}
                onChange={(e) => setFormData({ value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoFocus
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputModal;