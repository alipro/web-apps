/**
 *    Viewport.js
 *
 *    Controller for the viewport
 *
 *    Created by Julia Radzhabova on 26 March 2014
 *    Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */

define([
    'core',
    'common/main/lib/view/Header',
    'presentationeditor/main/app/view/DocumentPreview',
    'presentationeditor/main/app/view/Viewport'
//    'documenteditor/main/app/view/LeftMenu'
], function (Viewport) {
    'use strict';

    PE.Controllers.Viewport = Backbone.Controller.extend({
        // Specifying a Viewport model
        models: [],

        // Specifying a collection of out Viewport
        collections: [],

        // Specifying application views
        views: [
            'Viewport',   // is main application layout
            'Common.Views.Header',
            'DocumentPreview'
        ],

        // When controller is created let's setup view event listeners
        initialize: function() {
            // This most important part when we will tell our controller what events should be handled
            this.addListeners({
                // Events generated by main view
                'Viewport': {

                }
            });
        },

        setApi: function(api) {
            this.api = api;
        },


        // When our application is ready, lets get started
        onLaunch: function() {
            // Create and render main view
            this.viewport = this.createView('Viewport').render();
            this.header   = this.createView('Common.Views.Header', {
                headerCaption: 'Presentation Editor'
            }).render();
            this.docPreview   = this.createView('DocumentPreview', {}).render();

            Common.NotificationCenter.on('layout:changed', _.bind(this.onLayoutChanged, this));
            $(window).on('resize', _.bind(this.onWindowResize, this));

            var leftPanel = $('#left-menu');
            this.viewport.hlayout.on('layout:resizedrag', function() {
                this.api.Resize();
                Common.localStorage.setItem('pe-mainmenu-width',leftPanel.width());
            }, this);
        },

        onLayoutChanged: function(area) {
            switch (area) {
            default:
                this.viewport.vlayout.doLayout();
            case 'rightmenu':
                this.viewport.hlayout.doLayout();
                break;
            case 'leftmenu':
                var panel = this.viewport.hlayout.items[0];
                if (panel.resize.el) {
                    panel.el.width() > 40 ? panel.resize.el.show() : panel.resize.el.hide();
                }
                this.viewport.hlayout.doLayout();
                break;
            case 'header':
            case 'toolbar':
            case 'status':
                this.viewport.vlayout.doLayout();
                break;
            }
            this.api.Resize();
        },

        onWindowResize: function(e) {
            this.onLayoutChanged('window');
        }
    });
});