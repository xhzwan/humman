<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="role">
            <el-row style="height: 60px">
              <el-button type="primary" size="small" @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <el-table :data="list" stripe style="width: 100%" border>
              <el-table-column
                type="index"
                label="序号"
                width="120"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="name"
                label="名称"
                width="240"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="description"
                label="描述"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="操作"
                header-align="center"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button size="small" type="danger" @click="delRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                @size-change="changeSize"
                @current-change="changePage"
                :current-page="page.page"
                :page-sizes="[5, 10, 15]"
                :page-size="page.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"
              >
              </el-pagination>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="公司信息" name="setting">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <AddDept ref="roleRef" :show-dialog.sync="showDialog" @updateRole="getRole">
    </AddDept>
    <!-- <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>

      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog> -->
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole } from "@/api/setting";
import { mapGetters } from "vuex";
import AddDept from "./components/add-dept";
export default {
  name: "Setting",
  data() {
    return {
      form: null,
      showDialog: false,
      activeName: "role",
      list: [],
      page: {
        page: 1,
        pagesize: 5,
        total: 0,
      },
      formData: {},

      roleForm: {},
      // rules: {
      //   name: [
      //     { required: true, message: "角色名称不能为空", trigger: "blur" },
      //   ],
      // },
    };
  },
  components: {
    AddDept,
  },
  created() {
    this.getRole();
    this.getCompany();
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  methods: {
    async editRole(id) {
      console.log(this.$refs.roleRef);
      await this.$refs.roleRef.loadDeatil(id);
      this.showDialog = true;
    },
    // async btnOK() {
    //   try {
    //     await this.$refs.roleForm.validate();

    //     if (this.roleForm.id) {
    //       await updateRole(this.roleForm);
    //     } else {
    //       await addRole(this.roleForm);
    //     }
    //     // 重新拉取数据
    //     this.getRole();
    //     this.$message.success("操作成功");
    //     this.showDialog = false;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    // btnCancel() {
    //   this.roleForm = {
    //     name: "",
    //     description: "",
    //   };
    //   // 移除校验
    //   this.$refs.roleForm.resetFields();
    //   this.showDialog = false;
    // },

    async getRole() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    async getCompany() {
      this.formData = await getCompanyInfo(this.companyId);
    },
    async delRole(id) {
      //  提示
      try {
        await this.$confirm("确认删除该角色吗");
        await deleteRole(id);
        if (this.list.length === 1 && this.page.page > 1) {
          this.page.page--;
        }
        this.getRole();

        this.$message.success("删除角色成功");
      } catch (error) {
        console.log(error);
      }
    },
    changePage(newPage) {
      this.page.page = newPage;
      this.getRole();
    },
    changeSize(newsize) {
      this.page.pagesize = newsize;
      this.getRole();
    },
  },
};
</script>


<style>
</style>
