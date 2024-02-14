<template>
    <div class="relative">
        <div @click="toggleDropdown" class="form-input cursor-pointer">
            <span v-if="!modelValue.length" class="text-blue-600">{{ defaultLabel }}</span>
            <span v-else-if="modelValue.length === 1" class="text-blue-600">{{ modelValue[0] }}</span>
            <span v-else class="text-blue-600">{{ modelValue.length }} Tags Selected</span>
        </div>
        <div v-show="openDropdown" class="absolute z-10 bg-white mt-1 rounded-md shadow-lg border w-content right-0"
            style="min-width: 10rem;">
            <ul class="max-h-60 overflow-auto">
                <li v-for="option in filteredOptions" :key="option" @click="selectOption(option)"
                    class="cursor-pointer select-none p-2 hover:bg-blue-100">
                    {{ option }}
                    <span v-if="modelValue.includes(option)" class="material-icons text-sm">check</span>
                </li>
            </ul>
            <div v-if="modelValue.length !== 0" class="p-2 flex flex-wrap gap-2 flex-col">
                <span v-for="tag in modelValue" :key="tag"
                    class="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium flex items-center flex-1 mr-2">
                    {{ tag }}
                    <i class="material-icons text-sm cursor-pointer ml-auto" @click.stop="removeTag(tag)">cancel</i>
                </span>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';

export default defineComponent({
    name: 'CustomSelect',
    props: {
        options: {
            type: Array as () => string[],
            required: true,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: Array as () => string[],
            default: () => [],
        },
        defaultValue: {
            type: String,
            default: 'Select options',
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const openDropdown = ref(false);

        const filteredOptions = computed(() =>
            props.options.filter(
                (option) => !props.modelValue.includes(option)
            )
        );

        function toggleDropdown() {
            openDropdown.value = !openDropdown.value;
        }

        function selectOption(option: string) {
            let newValue;
            if (props.multiple) {
                newValue = props.modelValue.includes(option)
                    ? props.modelValue.filter(item => item !== option)
                    : [...props.modelValue, option];
            } else {
                newValue = [option];
                openDropdown.value = false;
            }
            emit('update:modelValue', newValue);
        }

        function removeTag(tag: string) {
            const newValue = props.modelValue.filter(item => item !== tag);
            emit('update:modelValue', newValue);
        }

        watch(() => openDropdown.value, (newValue) => {
            if (!newValue) {
                document.removeEventListener('click', handleClickOutside);
                document.removeEventListener('keydown', handleEscape);
            } else {
                document.addEventListener('click', handleClickOutside);
                document.addEventListener('keydown', handleEscape);
            }
        });
        function handleClickOutside(event: MouseEvent) {
            if (props.multiple) return;

            if (!event.target) return;
            if (openDropdown.value && !(event.target as Element).closest('.relative')) {
                openDropdown.value = false;
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                openDropdown.value = false;
            }
        }

        let defaultLabel;
        if (!props.multiple) {
            defaultLabel = computed(() => props.defaultValue || props.options[0]);
        } else {
            defaultLabel = computed(() => props.defaultValue || 'Select options');
        }

        return {
            openDropdown,
            toggleDropdown,
            selectOption,
            removeTag,
            filteredOptions,
            defaultLabel,
        };
    },
});
</script>
  