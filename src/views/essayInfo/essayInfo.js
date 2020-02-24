import * as allUrls from '../../utils/allUrls.js'
import * as commonFunc from '../../utils/commonFunc'

export default {
    name: "essayInfo",
    inject: ['reload'],
    data() {
        return {
            essayId: '',
            essayInfo: {}, //文章信息
            value: 0,  //打分文章推荐星级
            isRateValue: 0,  //文章等级分数
            dialogVisible: false,
            isSetScore: false, //判断用户是否已打分
            userInfo: JSON.parse(sessionStorage.getItem('userInfo')), //用户信息
            isUser: false,
            commentDialog: false, //发布评论弹窗
            comment: '', //评论内容
            commentLists: '', //评论列表
            defaultCommentLoad: 4,
            commentLoadText: '加载更多',
        }
    },
    methods: {
        //获取用户评分等级
        getUserScore() {
            allUrls.getScore({
                username: this.essayInfo.username,
            }, 'post').then(res => {
                return res.json();
            }).then(data => {
                if (+data.status === 200) {
                    //获取有多少个评分
                    let scoreLength = data.data.length;
                    let sum = 0;
                    for (let i in data.data) {
                        sum = sum + (+data.data[i].score);
                    }
                    let _score = (sum / scoreLength).toFixed(1);
                    this.isRateValue = +_score || 0;
                } else {
                    this.$message.error("获取用户评分失败！");
                }
            }).catch(err => {
                console.log(err);
                this.$message.error("获取用户评分出错！");
            })
        },
        //获取文章信息
        getEssayInfo(val) {
            return new Promise((resolve, reject) => {
                allUrls.getEssay({
                    id: val,
                }, 'post').then(res => {
                    return res.json();
                }).then(data => {
                    if (+data.status === 200) {
                        this.essayInfo = data.data[0];
                        resolve();
                    } else {
                        this.$message.error("获取文章信息失败");
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error("获取文章信息出错！");
                })
            }).then(() => {
                //获取用户评分
                this.getUserScore();
                //获取用户是否已评分
                this._setScoreOrNot();
                //判断是否用户本人
                this.showOptions();
            })
        },
        //长时间浏览提示打分
        openDialog() {
            if (!this.isSetScore) {
                this.dialogVisible = true;
            }
        },
        //确认打分
        confirmScore() {
            if (!sessionStorage.getItem('userInfo')) {
                this.$message.warning('需登录才能评分喔~！');
                return false;
            } else if (this.value !== 0) {
                let _user = JSON.parse(sessionStorage.getItem('userInfo'));
                allUrls.setScore({
                    username: this.essayInfo.username,
                    score: this.value,
                    setedUser: _user.username,
                    essayID: this.essayInfo.id,
                }, 'post').then(res => {
                    return res.json();
                }).then(res => {
                    if (+res.status === 200) {
                        this.$message.success("打分成功，感谢您的打分~！");
                    } else {
                        this.$message.error("打分失败！");
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error("打分出现错误！");
                })
                this.dialogVisible = false;
            } else {
                this.$message.error("不可以打0分喔");
            }
        },
        //获取用户是否已打分
        _setScoreOrNot() {
            if (this.userInfo) {
                allUrls.setScoreOrNot({
                    setedUser: this.userInfo.username,
                    essayID: this.essayInfo.id,
                }, 'post').then(res => {
                    return res.json();
                }).then(res => {
                    if (+res.status === 200) {
                        this.isSetScore = true;
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error("获取用户是否已打分出错！");
                })
            }
        },
        //作者删除文章
        clickCommand(val) {
            if (val == 'a') {
                allUrls.deleteEssay({
                    id: this.$route.query.id
                }, 'post').then(res => {
                    return res.json();
                }).then(res => {
                    if (+res.status === 200) {
                        this.$message.success("删除成功");
                        this.$router.push('/essayList');
                    } else {
                        this.$message.error("删除失败");
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error("删除出现错误");
                })
            }
        },
        //判断是否作者本人
        showOptions() {
            if (this.userInfo) {
                this.isUser = this.userInfo.username == this.essayInfo.username;
            }
        },
        //发表评论
        postComment() {
            if (this.comment) {
                //    获取时间
                let time = commonFunc.getTime();
                allUrls.insertComment({
                    username: this.userInfo.username,
                    name: this.userInfo.name,
                    comment: this.comment,
                    date: time,
                    essayId: this.$route.query.id,
                }, 'post').then(res => {
                    return res.json();
                }).then(res => {
                    if (+res.status === 200) {
                        this.$message.success("评论成功");
                        this.commentDialog = false;
                        this.comment = '';
                        this.getComments();
                    } else {
                        this.$message.error("评论失败");
                    }
                }).catch(err => {
                    console.log(err);
                    this.$message.error("评论出现错误");
                })
            } else {
                this.$message.warning("请输入评论内容");
            }
        },
        //获取评论列表
        getComments() {
            allUrls.getComment({
                essayId: this.$route.query.id,
            }, 'post').then(res => {
                return res.json();
            }).then(res => {
                if (+res.status === 200) {
                    console.log('获取评论列表成功');
                    this.commentLists = res.data;
                    if (res.data.length <= this.defaultCommentLoad) {
                        this.commentLoadText = '没有更多评论啦！';
                    }
                } else {
                    this.$message.error("获取评论列表失败");
                }
            }).catch(err => {
                console.log(err);
                this.$message.error("获取评论列表出错");
            })
        },
        //加载更多评论
        loadMoreComments() {
            this.defaultCommentLoad += 4;
            if (this.commentLists.length <= this.defaultCommentLoad) {
                this.commentLoadText = '没有更多评论啦！';
            }
        },
    },
    mounted() {
        this.essayId = this.$route.query.id;
        this.getEssayInfo(this.essayId);
        this.$toTop.toTop();
        this.getComments();
        //浏览一分钟后提示打分
        setTimeout(() => {
            this.openDialog()
        }, 60000);
    }
}
