<template>
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    center
    @close="onClose('deptForm')"
  >
    <el-form
      ref="deptForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="部门名称:" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码:" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人:" prop="manager">
        <el-select
          @focus="getEmployee"
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍:" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="confirm('deptForm')"
          >确定</el-button
        >
        <el-button size="small" @click="onClose('deptForm')">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    const checkName = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        isRepeat = depts
          .filter(
            (item) =>
              item.pid === this.treeNode.id && item.pid !== this.treeNode.id
          )
          .some((item) => item.name === value);
      } else {
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value);
      }

      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback();
    };
    const checkCode = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        isRepeat = depts.some(
          (item) => item.id !== this.formData.id && item.code === value && value
        );
      } else {
        isRepeat = depts.some((item) => item.code === value && value);
      }

      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback();
    };
    return {
      formData: {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      },
      peoples: [],

      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "部门名称要求1-10个字符",
            trigger: "blur",
          },
          {
            validator: checkName,
            trigger: "blur",
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          {
            validator: checkCode,
            trigger: "blur",
          },
        ],
        manager: [
          {
            required: true,
            message: "部门负责人不能为空",
            trigger: "blur",
          },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            trigger: "blur",
            min: 1,
            max: 100,
            message: "部门介绍要求1-100个字符",
          },
        ],
      },
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增子部门";
    },
  },
  components: {},
  watch: {},
  methods: {
    // 获取员工简单列表数据
    async getEmployee() {
      this.peoples = await getEmployeeSimple();
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
    },

    async confirm(formName) {
      try {
        await this.$refs[formName].validate();
        if (this.formData.id) {
          await updateDepartments(this.formData);
          this.$message.success("编辑部门成功");
        } else {
          this.formData.pid = this.treeNode.id;
          await addDepartments(this.formData);
          this.$message.success("添加部门成功");
        }
        this.$emit("updatelist");
        this.$emit("update:showDialog", false); // 关闭
        this.$emit("update:pid", "");
        delete this.formData.pid;
      } catch (error) {
        this.$message.error("添加部门失败");
      }
    },
    onClose(formName) {
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      this.$refs[formName].resetFields(); // 重置校验字段
      this.$emit("update:showDialog", false); // 关闭
    },
  },
};
</script>
<style scoped>
</style>
