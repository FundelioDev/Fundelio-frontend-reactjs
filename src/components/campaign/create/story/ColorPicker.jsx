import { useState } from 'react';
import { Palette, ChevronDown } from 'lucide-react';

const DEFAULT_COLORS = [
  '#000000',
  '#434343',
  '#666666',
  '#999999',
  '#B7B7B7',
  '#CCCCCC',
  '#D9D9D9',
  '#EFEFEF',
  '#F3F3F3',
  '#FFFFFF',
  '#980000',
  '#FF0000',
  '#FF9900',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#4A86E8',
  '#0000FF',
  '#9900FF',
  '#FF00FF',
  '#E6B8AF',
  '#F4CCCC',
  '#FCE5CD',
  '#FFF2CC',
  '#D9EAD3',
  '#D0E0E3',
  '#C9DAF8',
  '#CFE2F3',
  '#D9D2E9',
  '#EAD1DC',
  '#DD7E6B',
  '#EA9999',
  '#F9CB9C',
  '#FFE599',
  '#B6D7A8',
  '#A2C4C9',
  '#A4C2F4',
  '#9FC5E8',
  '#B4A7D6',
  '#D5A6BD',
  '#CC4125',
  '#E06666',
  '#F6B26B',
  '#FFD966',
  '#93C47D',
  '#76A5AF',
  '#6D9EEB',
  '#6FA8DC',
  '#8E7CC3',
  '#C27BA0',
  '#A61C00',
  '#CC0000',
  '#E69138',
  '#F1C232',
  '#6AA84F',
  '#45818E',
  '#3C78D8',
  '#3D85C6',
  '#674EA7',
  '#A64D79',
  '#85200C',
  '#990000',
  '#B45F06',
  '#BF9000',
  '#38761D',
  '#134F5C',
  '#1155CC',
  '#0B5394',
  '#351C75',
  '#741B47',
  '#5B0F00',
  '#660000',
  '#783F04',
  '#7F6000',
  '#274E13',
  '#0C343D',
  '#1C4587',
  '#073763',
  '#20124D',
  '#4C1130',
];

const EXTENDED_COLORS = [
  // Reds & Pinks
  '#FFC0CB',
  '#FFB6C1',
  '#FF69B4',
  '#FF1493',
  '#C71585',
  '#DB7093',
  '#DC143C',
  '#B22222',
  '#8B0000',
  '#800000',
  // Oranges
  '#FFA07A',
  '#FF8C00',
  '#FF7F50',
  '#FF6347',
  '#FF4500',
  '#D2691E',
  '#A0522D',
  '#8B4513',
  '#800020',
  '#654321',
  // Yellows & Golds
  '#FFFACD',
  '#FAFAD2',
  '#FFE4B5',
  '#FFDAB9',
  '#EEE8AA',
  '#F0E68C',
  '#BDB76B',
  '#DAA520',
  '#B8860B',
  '#FFD700',
  // Greens
  '#90EE90',
  '#98FB98',
  '#8FBC8F',
  '#3CB371',
  '#2E8B57',
  '#228B22',
  '#008000',
  '#006400',
  '#556B2F',
  '#808000',
  // Cyans & Teals
  '#E0FFFF',
  '#AFEEEE',
  '#7FFFD4',
  '#40E0D0',
  '#48D1CC',
  '#00CED1',
  '#20B2AA',
  '#008B8B',
  '#008080',
  '#2F4F4F',
  // Blues
  '#ADD8E6',
  '#87CEEB',
  '#87CEFA',
  '#00BFFF',
  '#1E90FF',
  '#6495ED',
  '#4169E1',
  '#0000CD',
  '#00008B',
  '#000080',
  // Purples & Violets
  '#E6E6FA',
  '#D8BFD8',
  '#DDA0DD',
  '#EE82EE',
  '#DA70D6',
  '#FF00FF',
  '#BA55D3',
  '#9370DB',
  '#8A2BE2',
  '#4B0082',
  // Browns & Neutrals
  '#F5F5DC',
  '#FFE4C4',
  '#FFDEAD',
  '#F5DEB3',
  '#DEB887',
  '#D2B48C',
  '#BC8F8F',
  '#F4A460',
  '#CD853F',
  '#8B4513',
];

/**
 * ColorPicker component - Color selection dropdown
 * @param {Object} props
 * @param {Function} props.onColorSelect - Callback when color is selected
 */
export default function ColorPicker({ onColorSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const handleColorClick = (color) => {
    setSelectedColor(color);
    onColorSelect(color);
  };

  const displayedColors = showMore
    ? [...DEFAULT_COLORS, ...EXTENDED_COLORS]
    : DEFAULT_COLORS;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 border border-border bg-white dark:bg-darker rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:text-white"
        title="Text Color"
      >
        <Palette className="w-4 h-4" />
        <div
          className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: selectedColor }}
        />
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Color Palette */}
          <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-darker border border-border rounded-lg shadow-xl z-20 w-[280px] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="mb-2">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chọn màu chữ
              </p>
              {/* Color Grid */}
              <div className="grid grid-cols-10 gap-1.5">
                {displayedColors.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    onClick={() => handleColorClick(color)}
                    className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${selectedColor === color
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-gray-300 dark:border-gray-600'
                      }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Load More Button */}
            {!showMore && (
              <button
                onClick={() => setShowMore(true)}
                className="w-full mt-2 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors"
              >
                Xem thêm màu
              </button>
            )}

            {/* Custom Color Input */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2">
                <span className="text-xs text-gray-600 dark:text-text-white">
                  Màu tùy chỉnh:
                </span>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorClick(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
