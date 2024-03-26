import ecomPassport from '@ecomplus/passport-client'
import { mapMutations, mapActions } from 'vuex'
import TheAccount from '@ecomplus/storefront-components/src/TheAccount.vue'
import AccountForm from '@ecomplus/storefront-components/src/AccountForm.vue'
import AccountAddresses from '@ecomplus/storefront-components/src/AccountAddresses.vue'
import AccountPoints from '@ecomplus/storefront-components/src/AccountPoints.vue'
import EcOrdersList from '@ecomplus/storefront-app/src/components/EcOrdersList.vue'
import AccountGamification from './AccountGamification.vue'

export default {
  name: 'account',

  components: {
    TheAccount,
    AccountForm,
    AccountGamification,
    AccountAddresses,
    AccountPoints,
    EcOrdersList
  },

  data () {
    return {
      isMounted: false,
      ecomPassport,
      tal: false,
    }
  },

  computed: {
    customer: {
      get () {
        return this.$store.getters.customer
      },
      set (customer) {
        this.setCustomer(customer)
        const { ecomPassport } = this
        if (ecomPassport && ecomPassport.checkAuthorization() && this.isMounted) {
          this.triggerLoading(true)
          this.saveCustomer({ ecomPassport })
            .finally(() => this.triggerLoading(false))
        }
      }
    },

    currentTab: {
      get () {
        return this.$route.params.tab
      },
      set (tab) {
        if (tab !== this.$route.params.tab) {
          this.$router.push({
            name: 'account',
            params: {
              tab
            }
          })
        }
      }
    }
  },

  methods: {
    ...mapMutations([
      'triggerLoading',
      'setCustomer',
      'resetAccount'
    ]),

    ...mapActions([
      'fetchCustomer',
      'saveCustomer'
    ]),

    login (ecomPassport) {
      this.ecomPassport = ecomPassport
      this.triggerLoading(true)
      this.fetchCustomer({ ecomPassport })
        .finally(() => this.triggerLoading(false))
    },

    viewOrder ({ _id, number }) {
      if (number) {
        this.$router.push({
          name: 'order',
          params: { number, id: _id }
        })
      }
    }
  },

  mounted () {
    this.isMounted = true
  }
}
