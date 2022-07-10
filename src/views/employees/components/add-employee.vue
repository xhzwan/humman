<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    @close="btnCancel('addEmployee')"
  >
    <!-- 表单 -->
    <el-form
      :model="formData"
      :rules="rules"
      label-width="120px"
      ref="addEmployee"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          style="width: 50%"
          placeholder="请输入姓名"
          v-model="formData.username"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          style="width: 50%"
          placeholder="请输入手机号"
          v-model="formData.mobile"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          style="width: 50%"
          placeholder="请选择入职时间"
          v-model="formData.timeOfEntry"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <!-- 遍历只能遍历组件的数据 -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          style="width: 50%"
          placeholder="请输入工号"
          v-model="formData.workNumber"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <div class="block" @click="getDepart">
          <span class="demonstration"></span>
          <el-cascader
            style="width: 50%"
            placeholder="请选择部门"
            v-model="formData.departmentName"
            :options="deptsList"
            @change="selectValue"
            :props="deptsProps"
          ></el-cascader>
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          style="width: 50%"
          placeholder="请选择转正时间"
          v-model="formData.correctionTime"
        />
      </el-form-item>
    </el-form>

    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel('addEmployee')"
            >取消</el-button
          >
          <el-button type="primary" size="small" @click="btnOK('addEmployee')"
            >确定</el-button
          >
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from "@/api/constant/employees";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
import { addEmployee } from "@/api/employees";

export default {
  name: "Addemployee",
  EmployeeEnum,
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      EmployeeEnum, // 在data中定义数据
      // 表单数据
      deptsList: [], // 定义数组接收树形数据
      value: [],
      options: [],
      deptsProps: {
        value: "name",
        label: "name",
        expandTrigger: "hover",
      },
      loading: false, // 控制树的显示或者隐藏进度条
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },

      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
    };
  },

  methods: {
    async getDepart() {
      this.loading = true;
      const { depts } = await getDepartments();
      this.deptsList = tranListToTreeData(depts, "");
      this.loading = false;
    },
    selectValue(value) {
      this.formData.departmentName = value[value.length - 1];
    },
    async btnOK(formName) {
      try {
        await this.$refs[formName].validate();
        // 调用新增接口
        await addEmployee(this.formData); // 新增员工
        // 告诉父组件更新数据
        // this.$parent 可以直接调用到父组件的实例 实际上就是父组件this
        // this.$emit
        this.$message.success("新增员工成功");
        this.$parent.getEmployee();
        this.$parent.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    },
    btnCancel(formName) {
      // 重置原来的数据
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      };
      this.$refs[formName].resetFields(); // 重置校验结果
      this.$emit("update:showDialog", false);
    },
  },
};
</script>

<style>
</style>
