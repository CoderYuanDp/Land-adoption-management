<template>
  <div class="container">
    <div class="search-box">
      <a-input v-model:value="searchText" placeholder="请输入农场名称" allow-clear :maxlength="10"/>
      <a-button type="primary" @click="getFarm">搜索</a-button><br />
    </div>
    <div class="operat-box">
      <a-button type="primary" @click="showAddDig">添加</a-button>
    </div>
    <a-table :dataSource="dataSource" :columns="columns">
      <template v-slot:bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button size="small" @click="showEditDig(record)" style="margin-right: 20px;">修改</a-button>
          <a-button size="small" @click="delFarmItem(record)">删除</a-button>
        </template>
      </template>
    </a-table>

    <a-modal v-model:visible="farmInfoDig" width="800px" :title="modalType===0 ? '添加' : '修改'"
    :afterClose="resetFields" @ok="confirm" :maskClosable="false">
      <a-form :model="farmInfo" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="农场名">
          <a-input v-model:value="farmInfo.farmName" :maxlength="10" />
        </a-form-item>
        <a-form-item label="经纬度">
          <a-input v-model:value="farmInfo.lanlng" :maxlength="50" />
          <mapSelect @selectedLatlng="selectedLatlng"></mapSelect>
        </a-form-item>
        <a-form-item label="面积">
          <a-input v-model:value="farmInfo.area" addon-after="m²" :maxlength="10" />
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-model:value="farmInfo.address" :maxlength="50" />
        </a-form-item>
        <a-form-item label="模型">
          <a-input v-model:value="farmInfo.model" placeholder="请输入glb结尾模型链接" :maxlength="100"/>
        </a-form-item>
        <a-form-item label="图片">
          <a-input v-model:value="farmInfo.images" placeholder="请输入图片链接" :maxlength="500"/>
        </a-form-item>
        <a-form-item label="农场描述">
          <a-textarea v-model:value="farmInfo.farmDesc" :maxlength="200" showCount/>
        </a-form-item>
      </a-form>
    </a-modal>

  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Form, message } from 'ant-design-vue'
import { addFarm, editFarm, getFarmList, delFarm } from '@/api/farmApi'
import mapSelect from '@/components/mapSelect.vue'
const useForm = Form.useForm

export default defineComponent({
  components: { mapSelect },
  setup () {
    const searchText = ref('')
    const dataSource = ref([])
    const farmInfo = ref({
      farmName: '',
      lanlng: '',
      area: '',
      address: '',
      images: '',
      farmDesc: '',
      model: null
    })

    const columns = [{
      title: '农场名',
      dataIndex: 'farm_name',
      key: 'farm_name'
    }, {
      title: '农场经纬度',
      dataIndex: 'farm_lan_lng',
      key: 'farm_lan_lng'
    }, {
      title: '农场面积(m²)',
      dataIndex: 'farm_area',
      key: 'farm_area'
    }, {
      title: '农场地址',
      dataIndex: 'farm_address',
      key: 'farm_address'
    }, {
      title: '图片',
      dataIndex: 'farm_images',
      key: 'farm_images'
    }, {
      title: '农场描述',
      dataIndex: 'farm_desc',
      key: 'farm_desc'
    }, {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation'
    }]

    const showAddDig = () => {
      farmInfoDig.value = true
      modalType.value = 0
    }

    // eslint-disable-next-line camelcase
    const showEditDig = ({ farm_address, farm_area, farm_desc, farm_id, farm_images, farm_lan_lng, farm_name, model }) => {
      farmInfoDig.value = true
      // 在修改
      modalType.value = 1
      farmInfo.value = {
        farmId: farm_id,
        farmName: farm_name,
        lanlng: farm_lan_lng,
        area: farm_area,
        address: farm_address,
        images: farm_images,
        farmDesc: farm_desc,
        model: model
      }
    }

    // eslint-disable-next-line camelcase
    const delFarmItem = ({ farm_id }) => {
      delFarm({ farmId: farm_id }).then(res => {
        if (res.success) {
          message.success(res.message)
          getFarm()
        } else {
          message.error(res.message)
        }
      }).catch(err => {
        message.error(err)
      })
    }

    const farmInfoDig = ref(false)
    // 0添加 1修改
    const modalType = ref(0)
    // 重置表单
    const { resetFields } = useForm(farmInfo)

    const confirm = () => {
      console.log(farmInfo.value)
      if (modalType.value === 0) {
        addFarm(farmInfo.value).then(res => {
          if (res.success) {
            message.success(res.message)
            getFarm()
            farmInfoDig.value = false
          } else {
            message.error(res.message)
          }
        }).catch(err => {
          message.error(err)
        })
      } else {
        editFarm(farmInfo.value).then(res => {
          if (res.success) {
            message.success(res.message)
            getFarm()
            farmInfoDig.value = false
          } else {
            message.error(res.message)
          }
        }).catch(err => {
          message.error(err)
        })
      }
    }

    const getFarm = () => {
      getFarmList(searchText.value).then(res => {
        if (res.success) {
          dataSource.value = res.list
        } else {
          message.error(res.message)
        }
      }).catch(err => {
        message.error(err)
      })
    }
    getFarm()

    const selectedLatlng = (result) => {
      farmInfo.value.lanlng = result.lng + ',' + result.lat
      const geoc = new window.BMapGL.Geocoder()
      geoc.getLocation(result, function (rs) {
        const addComp = rs.addressComponents
        farmInfo.value.address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
      })
    }
    return {
      searchText,
      dataSource,
      columns,
      showAddDig,
      showEditDig,
      delFarmItem,
      farmInfoDig,
      modalType,
      resetFields,
      confirm,
      farmInfo,
      labelCol: {
        style: {
          width: '150px'
        }
      },
      wrapperCol: {
        span: 14
      },
      getFarm,
      selectedLatlng
    }
  }
})
</script>

<style lang="less" scoped>
.search-box {
  padding-bottom: 20px;
  /deep/ .ant-input-affix-wrapper {
    width: 300px;
    margin-right: 20px;
  }
}
.operat-box {
  padding: 0 0 20px 0;
}
</style>
