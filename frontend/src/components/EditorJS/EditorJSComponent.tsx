import { useEffect, useRef, forwardRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';

// Импорт плагинов EditorJS
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import LinkTool from '@editorjs/link';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';

export interface EditorJSComponentProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const EditorJSComponent = forwardRef<HTMLDivElement, EditorJSComponentProps>(({ 
  data, 
  onChange, 
  placeholder = 'Начните писать...', 
  readOnly = false 
}, ref) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!holderRef.current) return;

    // Инициализация EditorJS
    editorRef.current = new EditorJS({
      holder: holderRef.current,
      placeholder,
      readOnly,
      data: data || {
        blocks: []
      },
      tools: {
        header: {
          class: Header,
          config: {
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 2,
            placeholder: 'Введите заголовок...'
          }
        },
        paragraph: {
          class: Paragraph,
          config: {
            placeholder: 'Введите текст...'
          }
        },
        list: {
          class: List,
          config: {
            defaultStyle: 'unordered'
          }
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: '/api/fetch-url' // Заглушка для получения мета-данных ссылки
          }
        },
        image: {
          class: Image,
          config: {
            endpoints: {
              byFile: '/api/upload-image', // Заглушка для загрузки файлов
              byUrl: '/api/upload-image-by-url' // Заглушка для загрузки по URL
            },
            field: 'image',
            types: 'image/*',
            additionalRequestData: {},
            additionalRequestHeaders: {},
            buttonText: 'Выберите изображение',
            uploader: {
              uploadByFile: async (file: File) => {
                // Пока заглушка - в реальном проекте здесь будет API для загрузки
                console.log('Upload file:', file);
                return {
                  success: 1,
                  file: {
                    url: URL.createObjectURL(file)
                  }
                };
              },
              uploadByUrl: async (url: string) => {
                console.log('Upload by URL:', url);
                return {
                  success: 1,
                  file: {
                    url: url
                  }
                };
              }
            }
          }
        },
        quote: {
          class: Quote,
          config: {
            quotePlaceholder: 'Введите цитату...',
            captionPlaceholder: 'Автор цитаты'
          }
        },
        code: {
          class: Code,
          config: {
            placeholder: 'Введите код...'
          }
        },
        table: {
          class: Table,
          config: {
            rows: 2,
            cols: 3
          }
        },
        delimiter: {
          class: Delimiter
        }
      },
      onChange: async () => {
        if (onChange && editorRef.current) {
          try {
            const outputData = await editorRef.current.save();
            onChange(outputData);
          } catch (error) {
            console.error('Ошибка сохранения данных редактора:', error);
          }
        }
      },
      minHeight: 400,
      i18n: {
        messages: {
          ui: {
            'blockTunes': {
              'toggler': {
                'Click to tune': 'Нажмите для настройки',
                'or drag to move': 'или перетащите'
              }
            },
            'toolbar': {
              'toolbox': {
                'Add': 'Добавить'
              }
            },
            'popover': {
              'Filter': 'Поиск',
              'Nothing found': 'Ничего не найдено'
            }
          },
          toolNames: {
            'Header': 'Заголовок',
            'Text': 'Текст',
            'List': 'Список',
            'Link': 'Ссылка',
            'Image': 'Изображение',
            'Quote': 'Цитата',
            'Code': 'Код',
            'Table': 'Таблица',
            'Delimiter': 'Разделитель'
          },
          tools: {
            'header': {
              'Header': 'Заголовок',
              'Heading 1': 'Заголовок 1',
              'Heading 2': 'Заголовок 2',
              'Heading 3': 'Заголовок 3',
              'Heading 4': 'Заголовок 4',
              'Heading 5': 'Заголовок 5',
              'Heading 6': 'Заголовок 6'
            },
            'list': {
              'Ordered List': 'Нумерованный список',
              'Unordered List': 'Маркированный список'
            },
            'link': {
              'Add a link': 'Добавьте ссылку',
              'URL': 'URL'
            },
            'image': {
              'Select an Image': 'Выберите изображение',
              'Caption': 'Подпись',
              'With border': 'С рамкой',
              'Stretch image': 'Растянуть изображение',
              'With background': 'С фоном'
            },
            'quote': {
              'Align Left': 'По левому краю',
              'Align Center': 'По центру'
            },
            'code': {
              'Enter a code': 'Введите код'
            }
          },
          blockTunes: {
            'delete': {
              'Delete': 'Удалить',
              'Click to delete': 'Нажмите для удаления'
            },
            'moveUp': {
              'Move up': 'Переместить вверх'
            },
            'moveDown': {
              'Move down': 'Переместить вниз'
            }
          }
        }
      },
      onReady: () => {
        console.log('Editor.js готов к работе');
      }
    });

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
      }
    };
  }, []);

  // Метод для получения текущих данных
  const saveData = async (): Promise<OutputData | null> => {
    if (editorRef.current) {
      try {
        return await editorRef.current.save();
      } catch (error) {
        console.error('Ошибка сохранения данных:', error);
        return null;
      }
    }
    return null;
  };

  // Метод для очистки редактора
  const clear = async () => {
    if (editorRef.current) {
      await editorRef.current.clear();
    }
  };

  return (
    <div className="w-full">
      <div 
        ref={ref || holderRef}
        className={`
          prose max-w-none border border-gray-300 rounded-lg p-4 min-h-[400px] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20
          ${readOnly ? 'bg-gray-50' : 'bg-white'}
        `}
      />
    </div>
  );
});

EditorJSComponent.displayName = 'EditorJSComponent';

// Экспорт компонента с ref для доступа к методам
export default EditorJSComponent;
export type { EditorJSComponentProps };