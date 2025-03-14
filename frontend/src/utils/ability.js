import { Ability, AbilityBuilder } from '@casl/ability';

export default function defineAbilityFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (!user) {
    can('read', 'Product');
    can('read', 'Category');
    return build();
  }

  if (user.role === 'admin') {
    can('manage', 'all');
  } else {
    can('read', 'Product');
    can('read', 'Category');
    can('read', 'User', { _id: user._id });
    can('update', 'User', { _id: user._id });
    can('read', 'Order', { user: user._id });
    can('create', 'Order');
  }

  return build();
} 