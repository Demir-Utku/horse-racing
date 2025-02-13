<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg' | 'icon'
  }>(),
  {
    variant: 'default',
    size: 'md'
  }
)
</script>

<template>
  <button
    class="ui-button inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-[var(--background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50"
    :class="[
      {
        'bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90':
          variant === 'default'
      },
      {
        'border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]':
          variant === 'outline'
      },
      { 'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]': variant === 'ghost' },
      { 'h-9 px-3': size === 'sm' },
      { 'h-10 px-4': size === 'md' },
      { 'h-11 px-5': size === 'lg' },
      { 'h-10 w-10': size === 'icon' }
    ]"
  >
    <slot />
  </button>
</template>

<style>
.ui-button {
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 47.4% 11.2%);
  --border: hsl(214.3 31.8% 91.4%);
  --primary: hsl(222.2 47.4% 11.2%);
  --primary-foreground: hsl(210 40% 98%);
  --accent: hsl(210 40% 96.1%);
  --accent-foreground: hsl(222.2 47.4% 11.2%);
  --ring: hsl(215 20.2% 65.1%);
}
</style>
