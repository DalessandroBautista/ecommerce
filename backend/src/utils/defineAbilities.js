const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilityFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (!user) {
    // Usuario no autenticado
    can('read', 'Product');
    can('read', 'Category');
    return build();
  }

  if (user.isAdmin) {
    // Administrador tiene acceso completo
    can('manage', 'all');
  } else {
    // Usuario regular
    can('read', 'Product');
    can('read', 'Category');
    
    // Acciones sobre su propio perfil
    can('read', 'User', { _id: user._id.toString() });
    can('update', 'User', { _id: user._id.toString() });
    
    // Acciones sobre sus propios pedidos
    can('read', 'Order', { user: user._id.toString() });
    can('create', 'Order');
    can('update', 'Order', { user: user._id.toString(), isDelivered: false });
    
    // Reseñas de productos
    can('create', 'Review');
    
    // Restricciones explícitas
    cannot('delete', 'User');
    cannot('delete', 'Product');
    cannot('delete', 'Category');
    cannot('update', 'Product');
    cannot('update', 'Category');
    cannot('create', 'Product');
    cannot('create', 'Category');
  }

  return build();
}

module.exports = defineAbilityFor; 

function defineAbilityFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (!user) {
    // Usuario no autenticado
    can('read', 'Product');
    can('read', 'Category');
    return build();
  }

  if (user.isAdmin) {
    // Administrador tiene acceso completo
    can('manage', 'all');
  } else {
    // Usuario regular
    can('read', 'Product');
    can('read', 'Category');
    
    // Acciones sobre su propio perfil
    can('read', 'User', { _id: user._id.toString() });
    can('update', 'User', { _id: user._id.toString() });
    
    // Acciones sobre sus propios pedidos
    can('read', 'Order', { user: user._id.toString() });
    can('create', 'Order');
    can('update', 'Order', { user: user._id.toString(), isDelivered: false });
    
    // Reseñas de productos
    can('create', 'Review');
    
    // Restricciones explícitas
    cannot('delete', 'User');
    cannot('delete', 'Product');
    cannot('delete', 'Category');
    cannot('update', 'Product');
    cannot('update', 'Category');
    cannot('create', 'Product');
    cannot('create', 'Category');
  }

  return build();
}

module.exports = defineAbilityFor; 