import { Button } from '@/components/ui/button';
import { Apple, Carrot, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Category = 'all' | 'vegetable' | 'fruit';

interface CategoryFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const { t } = useLanguage();
  
  const categories: { value: Category; labelKey: string; icon: typeof LayoutGrid }[] = [
    { value: 'all', labelKey: 'category.all', icon: LayoutGrid },
    { value: 'vegetable', labelKey: 'category.vegetables', icon: Carrot },
    { value: 'fruit', labelKey: 'category.fruits', icon: Apple },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={activeCategory === category.value ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category.value)}
          className="gap-2"
        >
          <category.icon className="h-4 w-4" />
          {t(category.labelKey)}
        </Button>
      ))}
    </div>
  );
}
