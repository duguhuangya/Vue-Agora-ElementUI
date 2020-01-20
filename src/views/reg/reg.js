import * as requirUrls from '../../utils/allUrls'

export default {
    name: "reg",
    data() {
        return {
            form: {
                username: '',
                password: '',
                name: '',
                email: '',
                sex: '',
                address: '',
                appid: '',
            },
            //表单验证
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 4, max: 10, message: '名字长度在4~10位', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 6, max: 11, message: '密码长度在6~11位', trigger: 'blur'}
                ],
                name: [
                    {required: true, message: '请输入昵称', trigger: 'blur'},
                    {min: 2, max: 8, message: '昵称长度在2~8位', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '请输入邮箱号', trigger: 'blur'},
                    {type: 'email', message: '请输入正确邮箱号', trigger: 'blur'}
                ],
                sex: [
                    {required: true, message: '请选择性别', trigger: 'change'}
                ],
                address: [
                    {required: true, message: '请选择地区', trigger: 'change'}
                ]
            },
            //    次级选择器
            options: [
                {
                    value: 'guangzhou',
                    label: '广州',
                    children: [
                        {
                            value: 'haizhu',
                            label: '海珠',
                        },
                        {
                            value: 'tianhe',
                            label: '天河',
                        },
                        {
                            value: 'yuexiu',
                            label: '越秀',
                        },
                        {
                            value: 'baiyun',
                            label: '白云',
                        },
                        {
                            value: 'panyu',
                            label: '番禺',
                        },
                        {
                            value: 'conghua',
                            label: '从化',
                        },
                        {
                            value: 'zengcheng',
                            label: '增城',
                        },
                    ]
                },
                {
                    value: 'zhanjiang',
                    label: '湛江',
                    children: [
                        {
                            value: 'xiashan',
                            label: '霞山'
                        },
                        {
                            value: 'kaifaqu',
                            label: '开发区'
                        },
                        {
                            value: 'chikan',
                            label: '赤坎'
                        },
                    ]
                },
            ],
        }

    },
    methods: {
        toHome() {
            this.$router.push('/')
        },
        //    次级选择器-存入数据
        handleChange(val) {
            this.form.address = val[1];
        },
        //TODO 在执行注册之前，异步执行检测是否用户名重复，必须保证用户名唯一
        //点击注册
        doReg(regForm) {
            this.$refs[regForm].validate((valid) => {
                if (valid) {
                    //TODO 注册执行两个接口--添加用户信息--添加空间动态（要获取注册时间）
                    requirUrls.doRegister({
                        username: this.form.username,
                        name: this.form.name,
                        password: this.form.password,
                        email: this.form.email,
                        sex: this.form.sex,
                        address: this.form.address
                    }, 'post').then(r => {
                        return r.json();
                    }).then(res => {
                        if (+res.status === 200) {
                            this.$message.success("注册成功！");
                            setTimeout(() => {
                                this.$router.push('/login');
                            }, 800)
                        } else {
                            this.$message.error(res.desc);
                            console.log(res.desc);
                        }
                    }).catch(err => {
                        console.log(err);
                        this.$message.error("注册失败！");
                    })
                } else {
                    return false;
                }
            })
        }
    },
    watch: {
        username() {
            this.form.username = this.form.username.replace(/[\W]/g, '');
        }
    },
    computed: {
        username() {
            return this.form.username
        }
    }
}
