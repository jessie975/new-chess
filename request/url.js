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
        url: 'wx/chess/room/searchRoom?page=${pageId}&pagesize=10&searchkey=${searchkey}',
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
    getTimeTable: {
        url: '/wx/roundtime/getMatchRoundUser?matchId=${matchId}&roundno=${roundno}'
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
    }
};