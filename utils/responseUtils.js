
function createErrorResp(errorType, errorDesc) {
    return {
        success: false,
        meta: {
            error: errorType,
            message: errorDesc
        }
    }
}

function isUserTypeAuthourized(userType, action) {
    if (action.toLowerCase() == 'createevent' || action.toLowerCase() == 'updateevent') {
        return ['BUSINESS'].indexOf(userType) > -1 ? true : false;
    } else if (action.toLowerCase() == 'getevent' || action.toLowerCase() == 'deleteevent') {
        return ['BUSINESS', 'CLIENT'].indexOf(userType) > -1 ? true : false;
    } else if (action.toLowerCase() == 'approveevent' || action.toLowerCase() == 'rejectevent' || action.toLowerCase() == 'approveuser' || action.toLowerCase() == 'rejectuser') {
        return ['CLIENT'].indexOf(userType) > -1 ? true : false;
    } else if (action.toLowerCase() == 'getscanlist') {
        return ['BUSINESS', 'CLIENT'].indexOf(userType) > -1 ? true : false;
    } else if (action.toLowerCase() == 'addcompanyemployee' || action.toLowerCase() == 'addeventorganiser') {
        return ['BUSINESS'].indexOf(userType) > -1 ? true : false;
    } else {
        return true;
    }
}

module.exports.createErrorResp = createErrorResp;
module.exports.isAuthourized = isUserTypeAuthourized;