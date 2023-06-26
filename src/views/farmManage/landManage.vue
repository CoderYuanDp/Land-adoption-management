<template>
  <div class="container">
    <div class="search-box">
      <a-select
        v-model:value="searchText"
        placeholder="请输入农场名称"
        style="width: 200px"
        :allowClear="true"
      >
      <a-select-option v-for="farm in farmOptions" :value="farm.farm_id" :key="farm.farm_id">{{ farm.farm_name }}</a-select-option>
    </a-select>
      <a-button type="primary" @click="getLand">搜索</a-button>
    </div>
    <div class="operat-box">
      <a-button type="primary" @click="showAddDig">添加</a-button>
    </div>
     <a-table :dataSource="landList" :columns="landColumns" :pagination="false">
        <template v-slot:bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'is_adopted'">
            <span>{{record.is_adopted === 1 ? '是' : '否'}}</span>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <a-button @click="delLandItem(record)">删除</a-button>
          </template>
        </template>
      </a-table>

      <a-modal v-model:visible="landInfoDig" width="800px" title="添加"
      :afterClose="resetFields" @ok="confirm" :maskClosable="false">
        <a-form :model="landInfo" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="土块名">
            <a-input v-model:value="landInfo.land_name" :maxlength="10" />
          </a-form-item>
          <a-form-item label="面积">
            <a-input v-model:value="landInfo.land_area" addon-after="m²" :maxlength="10" />
          </a-form-item>
          <a-form-item label="可种植作物">
            <a-select
              v-model:value="landInfo.land_plants"
              :options="vegetable"
              mode="multiple"
              :field-names="{ label: 'key', value: 'value'}"
              :size="size"
              placeholder="请选择"
              style="width: 400px"
            ></a-select>
          </a-form-item>
          <a-form-item label="所属农场">
            <a-select
              v-model:value="landInfo.farm_id"
              placeholder="请输入农场名称"
              style="width: 200px"
              :allowClear="true"
            >
              <a-select-option v-for="farm in farmOptions" :value="farm.farm_id" :key="farm.farm_id">{{ farm.farm_name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="价格">
            <a-input-number v-model:value="landInfo.land_price" :min="0" :max="10000" />
          </a-form-item>
        </a-form>
      </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { getLandList, getFarmList, addLand, delLand } from '@/api/farmApi'
import { message, Form } from 'ant-design-vue'
const useForm = Form.useForm

export default defineComponent({
  setup () {
    const searchText = ref(undefined)
    const landList = ref([])
    const farmOptions = ref([])
    const getFarm = () => {
      getFarmList('').then(res => {
        if (res.success) {
          farmOptions.value = res.list
        } else {
          message.error(res.message)
        }
      }).catch(err => {
        message.error(err)
      })
    }
    getFarm()
    const landColumns = [
      {
        title: '土块名称',
        dataIndex: 'land_name',
        key: 'land_name',
        width: 200
      },
      {
        title: '所属农场',
        dataIndex: 'farm_name',
        key: 'farm_name',
        width: 200
      },
      {
        title: '经纬度',
        dataIndex: 'farm_lan_lng',
        key: 'farm_lan_lng',
        width: 200
      },
      {
        title: '面积(m²)',
        dataIndex: 'land_area',
        key: 'land_area',
        width: 100
      },
      {
        title: '可种作物',
        dataIndex: 'land_plants',
        key: 'land_plants'
      },
      {
        title: '位置',
        dataIndex: 'farm_address',
        key: 'farm_addres'
      },
      {
        title: '价格',
        dataIndex: 'land_price',
        key: 'land_price'
      },
      {
        title: '是否出售',
        dataIndex: 'is_adopted',
        key: 'is_adopted'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation'
      }
    ]

    const getLand = () => {
      getLandList(searchText.value).then(res => {
        if (res.success) {
          landList.value = res.list.map(item => {
            item.land_plants = JSON.parse(item.land_plants)
            item.land_plants = item.land_plants.map(plant => {
              return vgObj[plant]
            }).join('，')
            return item
          })
          if (res.list.length === 0) {
            message.warning('没有搜索到数据')
          }
        } else {
          message.error(res.message)
        }
      }).catch(err => message.error(err))
    }
    getLand()

    const editLand = (record) => {
      console.log(record.land_id)
    }

    const vegetable = [{
      key: '西蓝花',
      value: 'broccoli'
    }, {
      key: '白菜',
      value: 'cabbage'
    }, {
      key: '芹菜',
      value: 'celery'
    }, {
      key: '茄子',
      value: 'eggplant'
    }, {
      key: '莲藕',
      value: 'lotus'
    }, {
      key: '萝卜',
      value: 'turnip'
    }]

    const vgObj = {
      broccoli: '西蓝花',
      cabbage: '白菜',
      celery: '芹菜',
      eggplant: '茄子',
      lotus: '莲藕',
      turnip: '萝卜'
    }

    const landInfoDig = ref(false)
    const showAddDig = () => {
      landInfoDig.value = true
    }
    const landInfo = reactive({
      land_name: '',
      land_plants: [],
      land_area: '',
      farm_id: '',
      land_price: 0
    })
    const { resetFields } = useForm(landInfo)
    const confirm = () => {
      addLand(landInfo).then(res => {
        if (res.success) {
          message.success('添加成功')
          getLand()
          landInfoDig.value = false
        } else {
          message.error('添加失败')
        }
      }).catch(err => message.error(err))
    }
    // eslint-disable-next-line camelcase
    const delLandItem = ({ land_id }) => {
      delLand({ land_id }).then(res => {
        if (res.success) {
          message.success('删除成功')
          getLand()
        } else {
          message.error('删除失败')
        }
      }).catch(err => message.error(err))
    }
    return {
      searchText,
      landList,
      landColumns,
      getLand,
      editLand,
      farmOptions,
      landInfoDig,
      landInfo,
      labelCol: {
        style: {
          width: '150px'
        }
      },
      wrapperCol: {
        span: 14
      },
      resetFields,
      confirm,
      showAddDig,
      delLandItem,
      vegetable
    }
  }
})
</script>

<style lang="less" scoped>
.search-box {
  padding-bottom: 20px;
  :deep(.ant-select) {
    margin-right: 20px;
  }
}
.operat-box {
  padding: 0 0 20px 0;
}
</style>
