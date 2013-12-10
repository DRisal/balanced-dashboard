Balanced.EditTransactionModalComponent = Ember.Component.extend({
	classNames: ['modal-container', 'header-action-container'],

	actions: {
		open: function() {
			// operate on a copy so we don't mess up the original object
			var copiedTransaction = Ember.copy(this.get('transaction'), true);
			copiedTransaction.set('isNew', false);
			copiedTransaction.trigger('didCreate');

			this._super(copiedTransaction);
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var transaction = this.get('model');
			var self = this;

			transaction.save().then(function() {
				self.get('transaction').updateFromModel(transaction);
				self.hide();
			});
		}
	}
});
