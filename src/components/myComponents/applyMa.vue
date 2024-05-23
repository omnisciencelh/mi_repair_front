<template>
  <div class="modal" v-show="showMaterial">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2 style="text-align: center;">申请材料表</h2>
      <div class="container">
        <el-container class="table-material-list flex-item">
          <h3 style="text-align: center;">材料列表</h3>
          <el-header>
            <div class="search">
              <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="材料名称">
                  <el-input v-model="searchForm.name" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="材料类型">
                  <el-input v-model="searchForm.type" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="searchOrder">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-header>
          <el-main>
            <el-table
              :data="materialList"
              stripe>
              <el-table-column
                prop="name"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="typeInfo"
                label="类型">
              </el-table-column>
              <el-table-column
                prop="price"
                label="价格">
              </el-table-column>
              <el-table-column
                prop="amount"
                label="库存">
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button @click="selectClick(scope.row)" type="text" size="small">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <div style="text-align: center;">
              <el-pagination
                @current-change="currentPageChange"
                layout="prev, pager, next"
                :total="50">
              </el-pagination>
            </div>
          </el-footer>
        </el-container>
        <el-container class="table-apply-material flex-item">
          <el-header><h3 style="text-align: center;">我申请的材料</h3></el-header>
          <el-main>
            <el-table
              :data="resultTable"
              height="250"
              stripe>
              <el-table-column
                type="selection"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="typeInfo"
                label="类型">
              </el-table-column>
              <el-table-column
                prop="price"
                label="价格">
              </el-table-column>
              <el-table-column
                label="数量">
                <template slot-scope="scope">
                  <!-- 这里使用scope.row来获取当前行的数据，假设你想绑定到一个名为'quantity'的字段 -->
                  <el-input-number
                    v-model="scope.row.quantity"
                    @change="handleChange(scope.$index, scope.row)"
                    :min="1"
                    :max="scope.row.amount"
                    label="申请数量"
                    placeholder="请输入申请数量"
                  ></el-input-number>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
import { } from '@/api/comment/repairOrder'
export default {
  props: {
    showMaterial: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    },
    selectSet: null
  },
  data () {
    return {
      materialList: [
        {
          id: '1',
          name: '玻璃XX',
          type: 0,
          typeInfo: '玻璃',
          price: 23,
          amount: 9
        },
        {
          id: '2',
          name: '玻璃XX',
          type: 0,
          typeInfo: '玻璃',
          price: 23,
          amount: 9
        },
        {
          id: '3',
          name: '玻璃XX',
          type: 0,
          typeInfo: '玻璃',
          price: 23,
          amount: 9
        },
        {
          id: '4',
          name: '玻璃XX',
          type: 0,
          typeInfo: '玻璃',
          price: 23,
          amount: 9
        },
        {
          id: '5',
          name: '玻璃XX',
          type: 0,
          typeInfo: '玻璃',
          price: 23,
          amount: 9
        }
      ],
      searchForm: {
        orderId: '',
        status: '',
        page: 1,
        pageSize: 5
      },
      resultTable: []
    }
  },
  created () {
    this.searchMaterial()
  },
  methods: {
    // 关闭遮盖层
    closeModal () {
      this.showMaterial = false
      this.$emit('closeModal')
    },
    // 查询材料
    searchMaterial () {
    },
    // 选择材料
    handleChange (value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    },
    selectClick (row) {
      debugger
      if (!this.selectSet) {
        this.selectSet = new Set()
      }
      if (!this.selectSet.has(row.id)) {
        this.selectSet.add(row.id)
        this.resultTable.push(row)
      }
    }
  }
}
</script>

<style scoped>
  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
    z-index: 9998; /* 确保z-index比其他元素高 */
  }

  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 100%; /* 或指定一个固定的宽度 */
    height: 100%;
  }

  .container {
    display: flex; /* 设置为弹性容器 */
    justify-content: center; /* 水平居中（可选） */
    align-items: stretch; /* 垂直方向拉伸（默认） */
  }
  .flex-item {
    /* 这里的样式可以根据需要进行调整 */
    flex: 1; /* 弹性因子，表示每个项目占据的空间比例，这里设为1表示等宽 */
    margin: 10px; /* 可以添加间距 */
    /* 其他样式 */
  }
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
</style>
