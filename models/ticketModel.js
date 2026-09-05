import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TicketHistorySchema = new Schema({
  ticketNo: {
    type: Number,
    required: true,
  },
  changes: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      fields: {
        type: Object,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: true,
      },
    },
  ],
});

const TicketSchema = new Schema(
  {
    ticketNo: {
      type: Number,
      unique: true,
    },
    contract: {
      type: Object,
      required: [true, "Contract Number required, Cannot be empty"],
    },
    complainMode: {
      type: String,
      enum: ["phone", "email", "inspection"],
      required: [true, "Contract Mode required, Cannot be empty"],
    },
    modeDetails: {
      type: Object,
    },
    issue: {
      location: String,
      details: String,
      treatment: { type: String, default: "Anti Termite Treatment" },
    },
    createdBy: { id: String, username: String },
    status: {
      type: String,
      enum: ["Open", "Assigned", "Closed", "Canceled"],
      default: "Open",
    },
    agent: {
      type: String,
      default: "",
    },
    scheduledTime: {
      type: String,
      default: "",
    },
    scheduledDate: {
      type: String,
      default: "",
    },
    resource: {
      type: String,
    },
    printcount: {
      type: Number,
      default: 0,
    },
    ticketImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

TicketSchema.pre("save", async function () {
  try {
    if (!this.isNew) return;

    const highestTicket = await this.constructor
      .findOne({}, "ticketNo")
      .sort({ ticketNo: -1 })
      .limit(1);

    const newTicketNo = (highestTicket ? highestTicket.ticketNo : 0) + 1;

    this.ticketNo = newTicketNo;
  } catch (error) {
    throw error;
  }
});

TicketSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    try {
      if (this.ticketNo)
        await TicketHistory.deleteOne({ ticketNo: this.ticketNo });
    } catch (error) {
      throw error;
    }
  },
);

TicketSchema.virtual("history", {
  ref: "TicketHistory",
  localField: "ticketNo",
  foreignField: "ticketNo",
  justOne: true,
});

const Ticket = mongoose.model("Ticket", TicketSchema);
const TicketHistory = mongoose.model("TicketHistory", TicketHistorySchema);

export { Ticket, TicketHistory };
