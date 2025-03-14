import React, { createContext, useContext, useEffect } from 'react';
import { Ability, AbilityBuilder } from '@casl/ability';
import { useSelector } from 'react-redux';

// Crear contexto
const AbilityContext = createContext();

// Hook personalizado para usar habilidades
export const useAbility = () => useContext(AbilityContext);

// Componente Can para comprobar permisos
export const Can = ({ I, a, this: target, children }) => {
  const ability = useAbility();
  return ability.can(I, a, target) ? children : null;
};

// Proveedor de habilidades
export const AbilityProvider = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  
  // Crear instancia de Ability
  const ability = new Ability();

  useEffect(() => {
    // Definir habilidades basadas en el usuario actual
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    
    if (!user) {
      // Usuario no autenticado
      can('read', 'Product');
      can('read', 'Category');
    } else if (user.isAdmin) {
      // Administrador
      can('manage', 'all');
    } else {
      // Usuario normal
      can('read', 'Product');
      can('read', 'Category');
      can('read', 'Order', { user: user._id });
      can('create', 'Order');
      can('update', 'User', { _id: user._id });
      
      // El usuario no puede editar productos, categorías, etc.
      cannot('update', 'Product');
      cannot('delete', 'Product');
      cannot('create', 'Product');
      cannot('update', 'Category');
      cannot('delete', 'Category');
      cannot('create', 'Category');
      cannot('read', 'User', { _id: { $ne: user._id } });
    }
    
    // Actualizar reglas
    ability.update(rules);
  }, [user]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};