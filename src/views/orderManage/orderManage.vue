<template>
  <div class="container">
    <div class="search-box">
      <a-select
        v-model:value="userId"
        placeholder="请输入用户昵称"
        style="width: 200px"
        :allowClear="true"
      >
        <a-select-option v-for="user in userOptions" :value="user.user_id" :key="user.user_id">{{ user.user_nickname }}</a-select-option>
      </a-select>
      <a-select
        v-model:value="farmId"
        placeholder="请输入农场名称"
        style="width: 200px"
        :allowClear="true"
      >
        <a-select-option v-for="farm in farmOptions" :value="farm.farm_id" :key="farm.farm_id">{{ farm.farm_name }}</a-select-option>
      </a-select>
      <a-button type="primary" @click="getOrderList">搜索</a-button>
    </div>

    <a-table :dataSource="dataSource" :columns="columns">
      <template v-slot:bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'order_type'">
          {{record.order_type === 0 ? '土地认养' : '蔬果采摘'}}
        </template>
        <template v-if="column.dataIndex === 'order_timestamp'">
          {{new Date(record.order_timestamp)}}
        </template>
        <template v-if="column.dataIndex === 'status_sproute'">
            <li :class="record.status_sproute ? 'right' : 'not'"></li>
        </template>
        <template v-if="column.dataIndex === 'status_germinate'">
          <li :class="record.status_germinate ? 'right' : 'not'"></li>
        </template>
        <template v-if="column.dataIndex === 'status_grow'">
          <li :class="record.status_grow ? 'right' : 'not'"></li>
        </template>
        <template v-if="column.dataIndex === 'status_mature'">
          <li :class="record.status_mature ? 'right' : 'not'"></li>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-button type="primary" @click="openStatusEditDig(record)">更新状态</a-button>
        </template>
      </template>
    </a-table>

    <a-modal v-model:visible="statusEditDig" width="800px" title="修改状态"
      :afterClose="resetFields" @ok="confirm" :maskClosable="false">
        <a-form :model="statusForm" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="发芽状态">
            <a-input v-model:value="statusForm.status_sproute" :maxlength="100" />
          </a-form-item>
          <a-form-item label="禾苗状态">
            <a-input v-model:value="statusForm.status_germinate" :maxlength="100" />
          </a-form-item>
          <a-form-item label="成长状态">
            <a-input v-model:value="statusForm.status_grow" :maxlength="100" />
          </a-form-item>
          <a-form-item label="成熟状态">
            <a-input v-model:value="statusForm.status_mature" :maxlength="100" />
          </a-form-item>
        </a-form>
      </a-modal>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { getFarmList } from '@/api/farmApi'
import { getUserList } from '@/api/userManageApi'
import { getOrder, editOrderStatus } from '@/api/orderManageApi'
import { message, Form } from 'ant-design-vue'
const useForm = Form.useForm

export default defineComponent({
  components: {
  },
  setup () {
    const userId = ref(undefined)
    const farmId = ref(undefined)
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

    const userOptions = ref([])
    const getUser = () => {
      getUserList('').then(res => {
        if (res.success) {
          userOptions.value = res.list
        } else {
          message.error(res.message)
        }
      }).catch(err => message.error(err))
    }
    getUser()
    const dataSource = ref([])
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'order_id',
        key: 'order_id'
      },
      {
        title: '类型',
        dataIndex: 'order_type',
        key: 'order_type'
      },
      {
        title: '价格',
        dataIndex: 'order_price',
        key: 'order_price'
      },
      {
        title: '时间',
        dataIndex: 'order_timestamp',
        key: 'order_timestamp'
      },
      {
        title: '用户',
        dataIndex: 'user_nickname',
        key: 'user_nickname'
      },
      {
        title: '土块名称',
        dataIndex: 'land_name',
        key: 'land_name'
      },
      {
        title: '农场名称',
        dataIndex: 'farm_name',
        key: 'farm_name'
      },
      {
        title: '发芽',
        dataIndex: 'status_sproute',
        key: 'status_sproute'
      },
      {
        title: '禾苗',
        dataIndex: 'status_germinate',
        key: 'status_germinate'
      },
      {
        title: '成长',
        dataIndex: 'status_grow',
        key: 'status_grow'
      },
      {
        title: '成熟',
        dataIndex: 'status_mature',
        key: 'status_mature'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation'
      }
    ]
    const getOrderList = () => {
      const data = {
        userId: userId.value,
        farmId: farmId.value
      }
      getOrder(data).then(res => {
        if (res.success) {
          dataSource.value = res.list
        } else {
          message.error(res.message)
        }
      }).catch(err => message.error(err))
    }
    getOrderList()
    const statusForm = ref({
      status_sproute: '',
      status_germinate: '',
      status_grow: '',
      status_mature: ''
    })
    const statusEditDig = ref(false)
    const { resetFields } = useForm(statusForm)
    // eslint-disable-next-line camelcase
    const openStatusEditDig = ({ order_id, status_sproute, status_germinate, status_grow, status_mature }) => {
      statusForm.value = {
        status_sproute,
        status_germinate,
        status_grow,
        status_mature,
        order_id: order_id
      }
      statusEditDig.value = true
    }
    const confirm = () => {
      editOrderStatus(statusForm.value).then(res => {
        if (res.success) {
          message.success(res.message)
          getOrderList()
          statusEditDig.value = false
        } else {
          message.error(res.message)
        }
      })
    }
    return {
      userId,
      farmId,
      farmOptions,
      userOptions,
      getOrderList,
      dataSource,
      columns,
      statusEditDig,
      openStatusEditDig,
      resetFields,
      statusForm,
      confirm,
      labelCol: {
        style: {
          width: '150px'
        }
      },
      wrapperCol: {
        span: 14
      }
    }
  }
})
</script>

<style lang="less" scoped>
.search-box {
  padding-bottom: 20px;
  /deep/ .ant-select {
    margin-right: 20px;
  }
}
.right {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: rgb(54, 172, 60);
  border-radius: 50%;
}
.not {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: rgb(179, 179, 179);
  border-radius: 50%;
}
</style>
