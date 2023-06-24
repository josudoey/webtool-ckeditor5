import { ref, h, watch } from 'vue'
import ClassicEditor from './ckeditor5/ClassicEditor.js'

function delay (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export default {
  setup () {
    const container = ref(null)
    const content = ref('demo')
    watch(content, (val) => {
      console.log(val)
    })

    return () => [
      h(ClassicEditor, {
        ref: container,
        modelValue: content.value,
        'onUpdate:modelValue' (value) {
          console.log(value)
          content.value = value
        },

        uploadAdapter (loader) {
          const uploadAdapter = {
            upload,
            abort
          }

          let reader
          function upload () {
            return new Promise((resolve, reject) => {
              loader.file.then(async (file) => {
                reader = new window.FileReader()
                reader.addEventListener('load', async () => {
                  for (let i = 0; i < 100; i++) {
                    loader.uploadedPercent = i
                    await delay(50)
                  }

                  resolve({ default: reader.result })
                })
                reader.readAsDataURL(file)
                reader.addEventListener('error', reject)
                reader.addEventListener('abort', reject)
              })
            })
          }

          function abort () {
            console.error('abort')
            if (reader) {
              reader.abort()
            }
          }

          return uploadAdapter
        }
      }),
      h('pre', { }, content.value)]
  }
}
