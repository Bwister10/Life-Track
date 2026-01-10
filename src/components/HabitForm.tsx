import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit } from '@/types/goals';
import { useState, useEffect } from 'react';
import EmojiPicker from './EmojiPicker';

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (habit: Partial<Habit>) => void;
  habit?: Habit;
  isPremium?: boolean;
  darkMode?: boolean;
}

const COLORS = ['#60A5FA', '#34D399', '#A78BFA', '#F472B6', '#FBBF24', '#F87171'];
const ICONS = ['💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '✍️', '🎵', '🎨'];

export const HabitForm = ({ open, onClose, onSave, habit, isPremium = false, darkMode = false }: HabitFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily' as 'daily' | 'weekly',
    color: COLORS[0],
    icon: ICONS[0],
  });

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description || '',
        frequency: habit.frequency,
        color: habit.color,
        icon: habit.icon,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        frequency: 'daily',
        color: COLORS[0],
        icon: ICONS[0],
      });
    }
  }, [habit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{habit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter habit name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details about your habit"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value: 'daily' | 'weekly') =>
                setFormData({ ...formData, frequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Icon</Label>
            <div className="flex items-center gap-3 mt-2">
              <EmojiPicker
                selectedEmoji={formData.icon}
                onSelect={(emoji) => setFormData({ ...formData, icon: emoji })}
                isPremium={isPremium}
                darkMode={darkMode}
              />
              <div className="flex flex-wrap gap-1">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
                      formData.icon === icon
                        ? 'ring-2 ring-primary scale-110'
                        : 'hover:scale-105 bg-secondary'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Color</Label>
            <div className="flex gap-2 mt-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {habit ? 'Save Changes' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
