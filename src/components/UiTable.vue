<script setup lang="ts">
defineProps<{
  hasStickyHeader?: boolean
}>()
</script>

<template>
  <table class="ui-table min-w-full text-center border-separate border-spacing-0 relative">
    <thead class="bg-gray-100" :class="{ 'sticky top-0 z-10': hasStickyHeader }">
      <tr class="font-semibold text-gray-700 text-sm">
        <slot name="header" />
      </tr>
    </thead>

    <tbody>
      <slot name="body" />
    </tbody>
  </table>
</template>

<style>
.ui-table tbody tr {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.ui-table tbody tr:hover {
  background-color: var(--color-gray-50);
}

.ui-table th {
  /* Apply both top and bottom borders to the <th> */
  border-top: 1px solid var(--color-gray-500);
  border-bottom: 1px solid var(--color-gray-500);
  border-right: 1px solid var(--color-gray-500);

  padding: 0.25rem 0.5rem;
}

.ui-table td {
  /* For cells, apply the border to one of each side only (right but not left, bottom but not top) */
  border-bottom: 1px solid var(--color-gray-500);
  border-right: 1px solid var(--color-gray-500);

  padding: 0.25rem 0.5rem;
}
</style>
