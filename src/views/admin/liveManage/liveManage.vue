<template>
    <div class="liveManage">
        <div class="searchLive">
            <el-input placeholder="请输入用户名查询" v-model="input">
                <el-button slot="append" @click="searchHost">搜索</el-button>
            </el-input>
        </div>
        <div class="liveForm">
            <el-table
                v-loading="loadLiveForm"
                element-loading-text="列表加载中..."
                element-loading-fullscreen="false"
                :data="tableData"
                stripe
                height="550"
                style="width: 100%">
                <el-table-column
                    prop="id"
                    label="Id"
                    width="80">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="用户"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="appid"
                    label="Appid"
                    width="350">
                </el-table-column>
                <el-table-column
                    prop="operate"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="danger" plain @click="deleteRow(scope.row)" v-if="+scope.row.liveStatus === 1">
                            禁播
                        </el-button>
                        <el-button type="success" plain @click="reLive(scope.row)" v-else>
                            恢复
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script src="./liveManage.js"></script>

<style scoped lang="scss">
    @import "liveManage";
</style>
