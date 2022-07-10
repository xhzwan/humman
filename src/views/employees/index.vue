<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共 {{ page.total }} 条记录</span>
        <template slot="after">
          <el-button
            type="warning"
            size="small"
            @click="$router.push('/import?type=user')"
            >导入</el-button
          >
          <el-button size="small" type="danger" @click="exportData"
            >导出</el-button
          >
          <el-button
            icon="plus"
            type="primary"
            size="small"
            @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable type="index" align="center" />
          <el-table-column
            label="姓名"
            sortable
            prop="username"
            align="center"
          />
          <el-table-column
            label="工号"
            sortable
            prop="workNumber"
            align="center"
          />
          <el-table-column
            label="聘用形式"
            sortable
            :formatter="formatEmployment"
            align="center"
            prop="formOfEmployment"
          />
          <el-table-column
            label="部门"
            sortable
            prop="departmentName"
            align="center"
          />
          <el-table-column label="入职时间" sortable align="center">
            <!-- 作用域插槽 -->
            <template slot-scope="{ row }">{{
              row.timeOfEntry | formatDate
            }}</template>
          </el-table-column>
          <el-table-column
            label="账户状态"
            align="center"
            sortable
            prop="enableState"
          >
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable
            fixed="right"
            width="280"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
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
            :page-sizes="[5, 10, 15, 20]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
          >
          </el-pagination>
        </el-row>
      </el-card>
    </div>
    <AddDemployee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees";
import AddDemployee from "./components/add-employee";
import { formatDate } from "@/filters";

export default {
  name: "Employees",
  components: {
    AddDemployee,
  },
  data() {
    return {
      showDialog: false,
      loading: false,
      list: [], // 接数据的

      page: {
        page: 1, // 当前页码
        size: 5,
        total: 0, // 总数
      },
    };
  },
  created() {
    this.getEmployee();
  },

  methods: {
    async getEmployee() {
      this.loading = true;
      const { total, rows } = await getEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
      this.loading = false;
    },

    async deleteEmployee(id) {
      try {
        await this.$confirm("您确定删除该员工吗");
        await delEmployee(id);
        if (this.list.length === 1 && this.page.page > 1) {
          this.page.page--;
        }
        this.getEmployee();
        this.$message.success("删除员工成功");
      } catch (error) {
        console.log(error);
      }
    },

    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值

      const obj = EmployeeEnum.hireType.find((item) => item.id == cellValue);
      return obj ? obj.value : "未知";
    },

    exportData() {
      const headers = {
        手机号: "mobile",
        姓名: "username",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };

      import("@/vendor/Export2Excel").then(async (excel) => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        const data = this.formatJson(headers, rows);
        const multiHeader = [["", "人员信息", "", "", "", "", ""]];
        const merges = ["A1:G1"];
        excel.export_json_to_excel({
          header: Object.keys(headers), //表头 必填
          data, //具体数据 必填
          filename: "员工信息表", //非必填
          multiHeader,
          merges,
          autoWidth: true, //非必填
          bookType: "xlsx", //非必填
        });
      });
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            return formatDate(item[headers[key]]);
          } else if (headers[key] === "formOfEmployment") {
            const obj = EmployeeEnum.hireType.find(
              (obj) => obj.id === +item[headers[key]]
            );
            return obj ? obj.value : "未知";
          }
          return item[headers[key]];
        });
      });
    },

    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployee();
    },
    changeSize(newsize) {
      this.page.size = newsize;
      this.getEmployee();
    },
  },
};
</script>

<style>
</style>
