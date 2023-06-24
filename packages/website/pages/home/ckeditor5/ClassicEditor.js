import { ref, onMounted, onUnmounted, h } from 'vue'

export default {
  compatConfig: { COMPONENT_V_MODEL: false },
  props: {
    modelValue: {
      type: String
    },
    uploadAdapter: {
      type: Function
    }
  },
  emits: [
    'update:modelValue'
  ],
  setup (props, { emit }) {
    const editor = ref(null)

    let editorInstance
    onMounted(async () => {
      const ClassicEditorModule = await import('@ckeditor/ckeditor5-build-classic')
      const { default: ClassicEditor } = ClassicEditorModule
      editorInstance = await ClassicEditor.create(editor.value)
      if (props.modelValue) {
        editorInstance.setData(props.modelValue)
      }
      editorInstance.model.document.on('change:data', () => {
        emit('update:modelValue', editorInstance.getData())
      })

      if (props.uploadAdapter) {
        editorInstance.plugins.get('FileRepository').createUploadAdapter = props.uploadAdapter
      }
    })

    onUnmounted(() => {
      if (editorInstance) {
        editorInstance.destroy()
      }
    })

    return {
      editor
    }
  },
  render () {
    return [
      h('div', { ref: 'editor', ...this.$attrs })
    ]
  }
}
