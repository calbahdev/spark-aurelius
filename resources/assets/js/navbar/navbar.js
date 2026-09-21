module.exports = {
    props: [
        'user', 'teams', 'currentTeam',
        'unreadAnnouncementsCount', 'unreadNotificationsCount'
    ],
    data(){
    	return {not:false}
	},

    computed:{
        notificationsCount(){
        var flg = false;
        var t = 200;
        if (this.user.id==4)
        t=50;
		if (this.unreadNotificationsCount||this.unreadAnnouncementsCount){
			var badge = document.getElementsByClassName('notification-pill')[0]
			badge.style.position = "fixed";
			badge.style.right = "11%";
			badge.style.zIndex = "100";
			this.not = setInterval(function(){
			if (flg)
				badge.style.background = "#f4f5f6";
			else
				badge.style.background = "black";
			flg = !flg;
			},t);
		}
            return this.unreadAnnouncementsCount + this.unreadNotificationsCount;
        }
    },


    methods: {
         /**
          * Show the user's notifications.
          */
         showNotifications() {
         var badge = document.getElementsByClassName('notification-pill')[0]
	 badge.style.background = "#f4f5f6";
	 badge.style.position = "relative";
	 badge.style.right = "auto";
	 badge.style.zIndex = "auto";
         
         clearInterval(this.not);
            Bus.$emit('showNotifications');
        },


        /**
         * Show the customer support e-mail form.
         */
        showSupportForm() {
            Bus.$emit('showSupportForm');
        }
    }
};
