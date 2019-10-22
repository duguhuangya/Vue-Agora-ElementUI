import liveStep from '@/components/liveStep/steps'

export default {
    name: "liveNum",
    components: {liveStep},
    inject: ['reload'],
    data() {
        return {
            stepActive: 0
        }
    },
    methods: {
        getStepActive(val) {
            this.stepActive = val;
        },
        //    判断是不是有直播编码
        getLiveNumber() {
            let reValue = sessionStorage.getItem('liveNum')
            console.log(reValue)
            if (reValue) {
                this.$message.warning('你已经有直播编码了，请勿重复申请');
                this.$router.push('/personalCenter');
            }
        }
    },
    mounted() {
        this.reload();
        this.getLiveNumber();
    }
}
