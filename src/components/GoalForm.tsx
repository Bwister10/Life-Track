import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Goal } from '@/types/goals';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import EmojiPicker from './EmojiPicker';

interface GoalFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: Partial<Goal>) => void;
  goal?: Goal;
  isPremium?: boolean;
  darkMode?: boolean;
}

const CATEGORIES = ['Personal', 'Career', 'Health', 'Finance', 'Learning', 'Other'];
const COLORS = ['#60A5FA', '#34D399', '#A78BFA', '#F472B6', '#FBBF24', '#F87171'];
const ICONS = ['🎯', '💼', '💪', '💰', '📚', '🎨', '🏃', '🧘', '🎵', '✈️'];

export const GoalForm = ({ open, onClose, onSave, goal, isPremium = false, darkMode = false }: GoalFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    deadline: format(new Date(), 'yyyy-MM-dd'),
    color: COLORS[0],
    icon: ICONS[0],
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description || '',
        category: goal.category,
        deadline: format(goal.deadline, 'yyyy-MM-dd'),
        color: goal.color,
        icon: goal.icon,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Personal',
        deadline: format(new Date(), 'yyyy-MM-dd'),
        color: COLORS[0],
        icon: ICONS[0],
      });
    }
  }, [goal, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      deadline: new Date(formData.deadline),
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter goal title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details about your goal"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label>Icon</Label>
            <div className="flex items-center gap-4 mt-2">
              <EmojiPicker
                selectedEmoji={formData.icon}
                onSelect={(emoji) => setFormData({ ...formData, icon: emoji })}
                isPremium={isPremium}
                darkMode={darkMode}
              />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {isPremium ? 'Choose any emoji for your goal' : 'Upgrade to Pro for more emojis'}
                </p>
                <div className="flex gap-1 mt-2">
                  {ICONS.slice(0, 6).map((icon) => (
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
              {goal ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
