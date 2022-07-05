<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools
          :treeNode="company"
          :is-root="true"
          @addDepts="addDepts"
        ></tree-tools>

        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <tree-tools
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="delDepart"
            @addDepts="addDepts"
            @editDepts="editDepts"
          ></tree-tools>
        </el-tree>
      </el-card>
    </div>
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @updatelist="getDepart"
    />
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue";
import { getDepartments, delDepartById } from "@/api/departments";
import { tranListToTreeData } from "@/utils/index";
import AddDept from "./components/add-dept";

export default {
  name: "Departments",
  data() {
    return {
      loading: false, // 用来控制进度弹层的显示和隐藏
      showDialog: false, // 显示窗体
      node: null,
      company: {},
      departs: [],
      defaultProps: {
        label: "name",
      },
    };
  },
  created() {
    this.getDepart();
  },
  components: {
    TreeTools,
    AddDept,
  },
  methods: {
    addDepts(node) {
      this.showDialog = true; // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node;
    },
    async getDepart() {
      this.loading = true;
      const res = await getDepartments();
      this.company = { name: res.companyName, manager: "负责人", id: "" };
      this.departs = tranListToTreeData(res.depts, "");
      this.loading = false;
    },
    async delDepart(id) {
      try {
        await delDepartById(id);

        this.$message.success("删除部门成功");
        this.getDepart();
      } catch (error) {
        this.$message.error("删除部门失败");
      }
    },
    async editDepts(node) {
      this.node = node;
      await this.$refs.addDept.getDepartDetail(node.id);
      this.showDialog = true;
    },
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
