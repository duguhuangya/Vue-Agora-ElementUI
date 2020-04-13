import * as allUrls from '../../utils/allUrls'

export default {
	name: "personalCenter",
	inject: ['reload', 'reloadView'],
	data() {
		return {
			userLoading: false,
			dialogVisible: false,
			loadingText: '用户查询中...',
			//用户信息
			userInfo: this.$store.state.userData,
			isUserSelf: false,
			//直播间信息
			roomForm: {
				channelName: '',
				username: '',
				channelSum: ''
			},
			//直播间信息表单填写规则
			rules: {
				channelName: [
					{required: true, message: "请填写直播间标题", trigger: 'blur'},
					{min: 1, max: 18, message: "标题长度只能在1~18位", trigger: 'blur'}],
			},
			isLive: false, //开播状态
		}
	},
	methods: {
		getUserInfo() {
			this.userLoading = true;
			let userIP = this.$route.query;
			if (userIP.username) {
				//    调用查询用户信息
				allUrls.getUserInfo({
					username: userIP.username,
				}, 'post').then(res => {
					return res.json();
				}).then(data => {
					return new Promise((resolve) => {
						if (+data.status === 200 && data.data.length > 0) {
							this.userInfo = data.data[0];
							this.userLoading = false;
							resolve();
						} else {
							setTimeout(() => {
								this.loadingText = '可能没有这个用户哦，建议重新查询~';
							}, 3000);
							return false;
						}
					}).then(() => {
						this.isUser();
						this.getIsLive(); //判断用户是否有直播
					})
				}).catch(err => {
					this.$message.error(err);
					console.log(err);
				})
			} else if (userIP.name) {
				//    根据用户昵称查询用户信息
				allUrls.getUserInfoByName({
					name: userIP.name,
				}, 'post').then(res => {
					return res.json();
				}).then(data => {
					return new Promise((resolve) => {
						if (+data.status === 200) {
							this.userInfo = data.data;
							this.userLoading = false;
							resolve();
						} else {
							setTimeout(() => {
								this.loadingText = '可能没有这个用户哦，建议重新查询~';
							}, 3000);
							return false;
						}
					}).then(() => {
						this.isUser(); //判断用户是否本人
						this.getIsLive(); //判断用户是否有直播
					})
				}).catch(err => {
					this.$message.error(err);
					console.log(err);
				})
			}
		},
		//    跳转至直播间编码申请
		toGetLiveNum() {
			this.$router.push('/liveNum/page1')
		},
		//    判断是否本人用户
		isUser() {
			let session = sessionStorage.getItem('userInfo');
			let _username = JSON.parse(session).username;
			this.isUserSelf = this.userInfo.username === _username;
			if (!this.isUserSelf) {
				this.$set(this.userInfo, 'appid', '*******')
			} else {
				allUrls.getAppid({
					username: this.userInfo.username,
				}, 'post').then(res => {
					return res.json();
				}).then(res => {
					if (+res.status === 200 || +res.status === 201) {
						this.$set(this.userInfo, 'appid', res.data.appid);
					} else {
						this.$message.error("获取appid失败！");
					}
				}).catch(err => {
					console.log(err);
					this.$message.error("获取appid出错！");
				})
			}
		},
		//点击创建直播间按钮
		createLive() {
			allUrls.getHostFuzzy({
				name: this.userInfo.name,
			}, 'post').then(res => {
				return res.json();
			}).then(res => {
				if (+res.status === 200) {
					if (res.data[0].liveStatus == '1') {
						this.dialogVisible = true;
						this.roomForm.name = this.userInfo.name;
					} else {
						this.$message.error("你的账号被禁止直播，请联系管理员");
					}
				} else {
					this.$message.error("获取用户信息开播状态失败！");
				}
			}).catch(err => {
				console.log(err);
				this.$message.error("获取用户信息开播状态出现错误！");
			})
		},
		//创建直播间
		toCreateLiveRoom(roomForm) {
			this.$refs[roomForm].validate(valid => {
				if (valid) {
					//替换空格
					this.roomForm.channelSum = this.roomForm.channelSum.replace(/\n/g, '<br/>')
					allUrls.updateHostInfo({
						title: this.roomForm.channelName,
						roomSum: this.roomForm.channelSum,
						isLive: 1, //1代表开播，0没开播
						username: this.userInfo.username,
					}, 'post').then(res => {
						return res.json();
					}).then(res => {
						if (+res.status === 200) {
							this.$router.push({
								path: '/liveRoom',
								query: {userType: 'host', hostName: this.userInfo.username}
							})
						} else {
							this.$message.error("更新主播表失败,开播失败!");
						}
					}).catch(err => {
						console.log(err);
						this.$message.error("更新主播表出错，开播失败！")
					})
				} else {
					return false;
				}
			})
		},
		//点击空间动态跳转
		toBlog() {
			this.$router.push({path: '/blog', query: {username: this.userInfo.username}})
		},
		//点击跳转个人信息编辑
		toEdit() {
			this.$router.push({path: '/editPage', query: {username: this.userInfo.username}})
		},
		//获取开播状态
		getIsLive() {
			allUrls.getLiveStatus({
				username: this.userInfo.username,
			}, 'post').then(res => {
				return res.json();
			}).then(res => {
				if (+res.status === 200 && res.data && +res.data.isLive === 1) {
					this.isLive = true;
				} else {
					this.isLive = false;
				}
			}).catch(err => {
				console.log(err);
				this.$message.error("获取开播状态接口错误！");
			})
		},
		//跳转至直播间
		toLiveRoom() {
			this.$router.push({path:'/liveRoom',query:{userType:'audience',hostName:this.userInfo.username}})
		},
	},
	filters: {
		//地区转译
		transAddress(val) {
			switch (val) {
				case 'kaifaqu':
					return '湛江 / 开发区';
				case 'haizhu':
					return '广州 / 海珠区';
				case 'tianhe':
					return '广州 / 天河区';
				case 'yuexiu':
					return '广州 / 越秀区';
				case 'baiyun':
					return '广州 / 白云区';
				case 'panyu':
					return '广州 / 番禺区';
				case 'conghua':
					return '广州 / 从化区';
				case 'zengcheng':
					return '广州 / 增城区';
				case 'xiashan':
					return '湛江 / 霞山区';
				case 'chikan':
					return '湛江 / 赤坎区';
				default:
					return '地区暂未录入';
			}
		},
		//性别转译
		transSex(val) {
			switch (val) {
				case '1':
					return '男';
				case '2':
					return '女';
				default :
					return '暂未录入性别';
			}
		}
	},
	mounted() {
		this.getUserInfo();
	},
	watch: {
		$route() {
			this.reloadView()
		}
	}
}
