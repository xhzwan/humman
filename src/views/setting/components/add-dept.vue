  <template>
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel('roleFormRef')"
  >
    <el-form
      ref="roleFormRef"
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
        <el-button size="small" @click="btnCancel('roleFormRef')"
          >取消</el-button
        >
        <el-button size="small" type="primary" @click="btnOK('roleFormRef')"
          >确定</el-button
        >
      </el-col>
    </el-row>
  </el-dialog>
</template>
  <script>
import { updateRole, addRole, getRoleDetail } from "@/api/setting";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      roleForm: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    showTitle() {
      return this.roleForm.id ? "编辑信息" : "新增信息";
    },
  },
  components: {},
  watch: {},
  methods: {
    async loadDeatil(id) {
      this.roleForm = await getRoleDetail(id);
    },
    async btnOK(forName) {
      try {
        await this.$refs[forName].validate();
        if (this.roleForm.id) {
          await updateRole(this.roleForm);
        } else {
          await addRole(this.roleForm);
        }
        // 重新拉取数据
        this.$message.success(`${this.roleForm.id ? "编辑" : "新增"}角色成功`);
        this.$emit("updateRole");
        this.$emit("update:showDialog", false); // 关闭
      } catch (error) {
        console.log(error);
      }
    },
    btnCancel(forName) {
      this.roleForm = {
        name: "",
        description: "",
      };
      // 移除校验
      this.$refs[forName].resetFields();
      this.$emit("update:showDialog", false);
    },
  },
};
</script>
  <style scoped>
</style>

