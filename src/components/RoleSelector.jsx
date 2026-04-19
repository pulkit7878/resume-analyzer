import { Sparkles } from 'lucide-react';
import { ROLES } from '../data/roles.js';

export function RoleSelector({ selectedRole, onSelect }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {ROLES.map((role) => {
        const active = role.id === selectedRole;

        return (
          <button
            key={role.id}
            type="button"
            onClick={() => onSelect(role.id)}
            className={`group rounded-3xl border p-4 text-left transition-all duration-300 ${
              active
                ? 'border-blue-400/50 bg-white/10 shadow-glow'
                : 'border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]'
            }`}
          >
            <div
              className={`mb-4 inline-flex rounded-2xl border border-white/10 bg-gradient-to-br p-2 ${role.accent}`}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-white">{role.label}</h3>
                {active && <span className="text-xs text-blue-200">Selected</span>}
              </div>
              <p className="text-sm leading-6 text-slate-400">{role.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
