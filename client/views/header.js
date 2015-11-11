Template.header.helpers({
    page : function (template) {
        var currentRoute = Router.current();
        return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
    }
});