<template>
  <div class="container">
    <div class="clearfix">
      <a-upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
        <a-button>
          <upload-outlined></upload-outlined>
          Select File
        </a-button>
      </a-upload>
      <a-button
        type="primary"
        :disabled="fileList.length === 0"
        :loading="uploading"
        style="margin-top: 16px;"
        @click="handleUpload"
      >
        {{ uploading ? 'Uploading' : 'Start Upload' }}
      </a-button>
    </div>
    <a-table :dataSource="dataSource" :columns="columns">
      <template v-slot:bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <span>{{ record.url }}</span> <img class="icon-size" @click="copyLink(record.url)" src="../../assets/icons/copy.png" alt="">
        </template>
        <template v-if="column.dataIndex == 'operation'">
          <a-button
            type="primary"
            size="small"
            @click="showImg(record.url)"
            style="margin-right: 8px;"
          >
            <a-icon type="edit"></a-icon>预览
          </a-button>
          <a-button
            type="primary"
            size="small"
            @click="handleDelete(record.url)"
            style="margin-right: 8px;"
          >
            <a-icon type="delete"></a-icon>删除
          </a-button>
        </template>
      </template>
    </a-table>
    <a-modal v-model:visible="showImgDig" width="800px" title="资源预览" :maskClosable="true">
        <img class="prve-img" :src="prevImgSrc" alt="资源预览">
        <template #footer>
        </template>
      </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { uploadFile, getUploadFiles, delFile } from '@/api/commonApi'
import { copyText } from '@/utils/tool'

export default defineComponent({
  components: { UploadOutlined },
  setup () {
    const fileList = ref([])
    const uploading = ref(false)
    const handleRemove = file => {
      const index = fileList.value.indexOf(file)
      const newFileList = fileList.value.slice()
      newFileList.splice(index, 1)
      fileList.value = newFileList
    }
    const beforeUpload = file => {
      fileList.value = [...fileList.value, file]
      return false
    }
    // 上传处理函数
    const handleUpload = () => {
      const formData = new FormData()
      fileList.value.forEach(file => {
        formData.append('files', file)
      })
      uploading.value = true
      uploadFile(formData).then((res) => {
        if (res.success) {
          fileList.value = []
          uploading.value = false
          getFileList()
          message.success('upload successfully.')
        } else {
          message.error(res.message)
        }
      }).catch(() => {
        uploading.value = false
        message.error('upload failed.')
      })
    }

    const dataSource = ref([])
    // 获取上传文件列表
    const getFileList = () => {
      getUploadFiles().then(res => {
        if (res.success) {
          dataSource.value = res.data
        } else {
          message.error(res.message)
        }
      }).catch((err) => {
        message.error(err.message)
      })
    }
    getFileList()

    const columns = [
      {
        title: '上传时间',
        dataIndex: 'date',
        key: 'date'
      },
      {
        title: '链接',
        dataIndex: 'url',
        key: 'url'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation'
      }
    ]

    const copyLink = (link) => {
      try {
        copyText(link)
        message.success('已复制到剪切板')
      } catch (err) {
        console.log(err)
        message.error('复制失败')
      }
    }
    const showImgDig = ref(false)
    const prevImgSrc = ref('')
    const showImg = (link) => {
      prevImgSrc.value = link
      showImgDig.value = true
    }
    const handleDelete = (link) => {
      console.log(link)
      const src = link.split('/')[3]
      console.log(src)
      delFile({ src }).then((res) => {
        if (res.success) {
          message.success('删除成功')
          getFileList()
        } else {
          message.error(res.message)
        }
      })
    }
    return {
      fileList,
      uploading,
      handleRemove,
      beforeUpload,
      handleUpload,
      dataSource,
      columns,
      copyLink,
      showImg,
      handleDelete,
      showImgDig,
      prevImgSrc
    }
  }
})
</script>

<style lang="less" scoped>
.container {
  padding-left: 40px;
  .clearfix {
    padding-bottom: 20px;
  }
  .icon-size {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
.prve-img {
  width: 100%;
  max-height: 90vh;
}
</style>
