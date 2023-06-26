<template>
  <div class="container">
    <div>
      <div class="t-c">
        <span class="tt">小程序首页轮播</span>
        <a-button type="primary" @click="showDddLunbo" style="width: 100px">添加</a-button>
      </div>
      <a-table :dataSource="lunboData" :columns="lunboColumns" :pagination="false">
        <template v-slot:bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button size="small" @click="delLunboItem(record)">删除</a-button>
          </template>
        </template>
      </a-table>

    </div>
    <div>
      <div class="t-c">
        <span class="tt">小程序热门农场</span>
        <a-button type="primary" @click="showAddHotFarm" style="width: 100px">添加</a-button>
      </div>
      <a-table :dataSource="hotfarmData" :columns="hotfarmColumns" :pagination="false">
        <template v-slot:bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button size="small" @click="delHotItem(record)">删除</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <!-- 轮播图 -->
  <a-modal v-model:visible="addLunboDig" width="500px" :title="modelType === 0 ? '添加轮播' : '添加热门农场'"
    :afterClose="resetFields" @ok="addLunboItem" :maskClosable="false">
      <a-form :model="lunboInfo">
        <a-form-item label="选择农场">
          <a-select
            ref="select"
            v-model:value="lunboInfo.farm_id"
            style="width: 120px"
            @change="farmSelectChange"
          >
            <a-select-option v-for="farm in farmOptions" :value="farm.farm_id" :key="farm.farm_id">{{ farm.farm_name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="图片url">
          <a-input v-model:value="lunboInfo.url" :maxlength="100" />
        </a-form-item>
      </a-form>
    </a-modal>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Form, message } from 'ant-design-vue'
import { addLunbo, delLunbo, getLunbo, addHotFarm, getALLhot, delHotFarm } from '@/api/dataManApi'
import { getFarmList } from '@/api/farmApi'
const useForm = Form.useForm

export default defineComponent({
  setup () {
    // #region
    // 0轮播 1热门
    const modelType = ref(0)
    const showDddLunbo = () => {
      addLunboDig.value = true
      modelType.value = 0
    }
    const showAddHotFarm = () => {
      addLunboDig.value = true
      modelType.value = 1
    }
    const lunboData = ref([])
    const lunboColumns = [
      {
        title: '农场名',
        dataIndex: 'farm_name',
        key: 'farm_name',
        width: 200
      },
      {
        title: 'url',
        dataIndex: 'url',
        key: 'url'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation'
      }
    ]
    const addLunboDig = ref(false)
    const lunboInfo = ref({
      farm_name: '',
      farm_id: '',
      url: ''
    })
    const { resetFields } = useForm(lunboInfo)
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
    const farmSelectChange = (e) => {
      farmOptions.value.forEach(item => {
        if (item.farm_id === e) {
          lunboInfo.value.farm_name = item.farm_name
        }
      })
    }
    const addLunboItem = () => {
      // 添加轮播
      if (modelType.value === 0) {
        addLunbo(lunboInfo.value).then(res => {
          if (res.success) {
            message.success(res.message)
            getAllLunbo()
            addLunboDig.value = false
          } else {
            message.error(res.message)
          }
        }).catch(err => message.error(err))
      } else {
        addHotFarm(lunboInfo.value).then(res => {
          if (res.success) {
            message.success(res.message)
            getAllHotFarm()
            addLunboDig.value = false
          } else {
            message.error(res.message)
          }
        }).catch(err => message.error(err))
      }
    }
    // eslint-disable-next-line camelcase
    const delLunboItem = ({ farm_id }) => {
      delLunbo({ farmId: farm_id }).then(res => {
        if (res.success) {
          message.success(res.message)
          getAllLunbo()
          addLunboDig.value = false
        } else {
          message.error(res.message)
        }
      }).catch(err => message.error(err))
    }
    const getAllLunbo = () => {
      getLunbo().then(res => {
        if (res.success) {
          lunboData.value = res.list
        } else {
          message.error(res.message)
        }
      }).catch(err => message.error(err))
    }
    getAllLunbo()
    // #endregion
    const hotfarmData = ref([])
    const hotfarmColumns = [
      {
        title: '农场名',
        dataIndex: 'farm_name',
        key: 'farm_name',
        width: 200
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation'
      }
    ]
    const getAllHotFarm = () => {
      getALLhot().then(res => {
        if (res.success) {
          hotfarmData.value = res.list
        } else {
          message.error(res.message)
        }
      }).catch(err => message.error(err))
    }
    getAllHotFarm()
    // eslint-disable-next-line camelcase
    const delHotItem = ({ farm_id }) => {
      delHotFarm({ farm_id }).then(res => {
        if (res.success) {
          message.success(res.message)
          getAllHotFarm()
          addLunboDig.value = false
        } else {
          message.error(res.message)
        }
      }).catch(err => message.error(err))
    }
    return {
      showDddLunbo,
      addLunboItem,
      showAddHotFarm,
      lunboColumns,
      lunboData,
      addLunboDig,
      lunboInfo,
      farmSelectChange,
      resetFields,
      farmOptions,
      delLunboItem,
      modelType,
      hotfarmData,
      hotfarmColumns,
      delHotItem
    }
  }
})
</script>

<style lang="less" scoped>
  .t-c {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
  .tt {
    font-size: 20px;
    font-weight: 800;
    padding-bottom: 20px;
  }
</style>
