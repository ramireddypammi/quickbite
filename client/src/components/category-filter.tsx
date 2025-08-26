import { Pizza, Beef, Leaf, IceCream, Coffee, Drumstick } from 'lucide-react';

const categories = [
  { name: 'Pizza', icon: Pizza, value: 'Italian' },
  { name: 'Burgers', icon: Beef, value: 'American' },
  { name: 'Healthy', icon: Leaf, value: 'Healthy' },
  { name: 'Desserts', icon: IceCream, value: 'Desserts' },
  { name: 'Coffee', icon: Coffee, value: 'Coffee' },
  { name: 'Chicken', icon: Drumstick, value: 'Chicken' },
];

interface CategoryFilterProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory?: string | null;
}

export default function CategoryFilter({ onCategorySelect, selectedCategory }: CategoryFilterProps) {
  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          <div 
            className={`flex-shrink-0 text-center cursor-pointer group ${!selectedCategory ? 'text-primary' : ''}`}
            onClick={() => onCategorySelect(null)}
            data-testid="button-category-all"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors ${
              !selectedCategory 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 group-hover:bg-primary group-hover:text-white'
            }`}>
              <span className="text-2xl">🍽️</span>
            </div>
            <span className={`text-sm transition-colors ${
              !selectedCategory 
                ? 'text-primary' 
                : 'text-gray-600 group-hover:text-primary'
            }`}>
              All
            </span>
          </div>
          
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.value;
            
            return (
              <div
                key={category.value}
                className={`flex-shrink-0 text-center cursor-pointer group ${isSelected ? 'text-primary' : ''}`}
                onClick={() => onCategorySelect(category.value)}
                data-testid={`button-category-${category.value.toLowerCase()}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  isSelected 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 group-hover:bg-primary group-hover:text-white'
                }`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className={`text-sm transition-colors ${
                  isSelected 
                    ? 'text-primary' 
                    : 'text-gray-600 group-hover:text-primary'
                }`}>
                  {category.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
