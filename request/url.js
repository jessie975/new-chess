module.exports = {
    getSwiperList: {
        url: 'ytkc_advert/advert/advertList'
    },
    getWheelList: {
        url: 'wx/chess/room/statusRoom?page=${pageId}&pagesize=10&status=${status}'
    },
    createRoom: {
        url: '/wx/chess/room/createRoom',
        method: 'post'
    },
    searchRoom: {
        url: 'wx/chess/room/searchRoom?page=${pageId}&pagesize=${pagesize}&searchKey=${searchKey}',
        method: 'post'
    },
    jumpWatch: {
        url: '/wx/chess/room/enterAudience/${roomid}',
        method: 'post'
    },
    jumpFight: {
        url: '/wx/chess/room/enterFight/${roomid}',
        method: 'post'
    },
    getEventList: {
        url: '/wx/match/matchList?page=${page}&pagesize=10&matchState=${matchState}'
    },
    getEventDetail: {
        url: '/wx/match/getMatchDtl'
    },
    signUpEvent: {
        url: '/wx/match/isEnrollMatch?matchId=${matchId}'
    },
    getTimeTable: {
        url: '/wx/roundtime/getMatchRoundUser?matchId=${matchId}&roundno=${roundno}'
    },
    getTimeTableMatch: {
        url: '/wx/roundtime/getMatchRoundtime?matchId=${matchId}'
    },
    getEventRange: {
        url: '/wx/match/matchRanking'
    },
    getMatchEnrollpsn: {
        url: '/wx/match/matchEnrollpsn?matchId=${matchId}'
    },
    getUserInfo: {
        url: '/wx/user/userInfo?targetUserId=${targetUserId}'
    },
    getUserGoodsInfo: {
        url: '/wx/user/userGoodsInfo'
    },
    modifyUserInfo: {
        url: '/wx/user/modifyUser',
        method: 'post'
    },
    getUserEventList: {
        url: '/wx/match/matchListIdentify?page=${page}'
    },
    getContact: {
        url: '/wx/user/contact'
    },
    getQuestion: {
        url: '/wx/user/qa'
    },
    getUserIdentity: {
        url: '/wx/user/identity'
    },
    applyPlusRoom: {
        url: '/wx/user/applyPlusRoom',
        method: 'post'
    }
};