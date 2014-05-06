Balanced.ImportPayoutsView = Balanced.View.extend({

	title: function() {
		return this.get("creditCreators.isEmpty") ?
			"Upload your file" :
			"Payout summary";
	}.property("creditCreators.isEmpty"),

	creditCreators: Ember.computed.oneWay("controller.creditCreators").readOnly(),

	payoutTotal: Balanced.computed.sum("creditCreators.valid", "credit.amount"),
	escrowTotal: Ember.computed.oneWay("controller.controllers.marketplace.in_escrow").readOnly(),
	escrowDifference: Balanced.computed.substract("escrowTotal", "payoutTotal"),

	isProcessable: Ember.computed.and("isEscrowValid", "creditCreators.isValid"),
	isUnprocessable: Ember.computed.not("isProcessable"),

	displayCsvRows: Ember.computed.and("creditCreators.length", "isEscrowValid", "creditCreators.isLoaded"),

	isEscrowValid: Ember.computed.gte("escrowDifference", 0),

	updateReaderBody: function(text) {
		var self = this;
		var modal = this.get("parseProgressBarModal");

		self.get("controller").refresh(text);
		modal.refresh(this.get("creditCreators"));

		setTimeout(function () {
			if (modal.get("isCompleted")) {
				modal.hide();
			}
		}, 300);
	},

	actions: {
		reset: function() {
			this.updateReaderBody(undefined);
		},

		confirmRemoveCreditCreator: function(creator) {
			var self = this;
			var modal = this.get("confirmRemoveModal");
			modal.on("cancel", function() {
				modal.send("close");
				modal.reset();
			});
			modal.on("confirm", function() {
				self.get("controller").send("removeCreditCreator", creator);
				modal.send("close");
				modal.reset();
			});
			modal.send("open");
		},

		submit: function() {
			var modal = this.get("saveProgressBarModal");
			modal.refresh(this.get("creditCreators"));
			this.get("controller").save(function() {
				modal.hide();
			});
		},

		fileSelectionChanged: function() {
			var self = this;
			var file = event.target.files[0];
			var reader = new FileReader();
			reader.onload = function(event) {
				var text = event.target.result;
				self.updateReaderBody(text);
			};
			reader.readAsText(file);
		}
	}
});
