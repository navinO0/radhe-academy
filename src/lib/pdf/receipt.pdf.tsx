import React from "react";
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    color: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#1a1a2e",
  },
  orgName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  orgSub: {
    fontSize: 9,
    color: "#666",
    marginTop: 2,
  },
  receiptTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  receiptNum: {
    fontSize: 11,
    color: "#444",
    textAlign: "right",
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: "#666",
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    color: "#555",
    fontSize: 9,
  },
  value: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textAlign: "right",
  },
  amountBox: {
    backgroundColor: "#f0f4ff",
    borderRadius: 6,
    padding: 12,
    marginTop: 8,
  },
  amountLabel: {
    fontSize: 9,
    color: "#555",
  },
  amountValue: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    marginTop: 2,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  footer: {
    marginTop: 32,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#888",
  },
});

interface ReceiptData {
  receiptNumber: string;
  amount: { toString(): string };
  paymentDate: Date;
  paymentMethod: string;
  transactionReference?: string | null;
  previousBalance: { toString(): string };
  remainingBalance: { toString(): string };
  student: { fullName: string; studentCode: string; email?: string | null };
  instalment?: { label: string } | null;
  payment?: { paymentMethod: string; transactionReference?: string | null } | null;
  generatedBy?: { name: string } | null;
  organization: { name: string };
}

function formatINR(amount: string): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(num);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function ReceiptDocument({ data }: { data: ReceiptData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.orgName}>{data.organization.name}</Text>
            <Text style={styles.orgSub}>Academy Management System • Payment Receipt</Text>
          </View>
          <View>
            <Text style={styles.receiptTitle}>OFFICIAL RECEIPT</Text>
            <Text style={styles.receiptNum}>#{data.receiptNumber}</Text>
          </View>
        </View>

        {/* Student Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{data.student.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Student Code:</Text>
            <Text style={styles.value}>{data.student.studentCode}</Text>
          </View>
          {data.instalment && (
            <View style={styles.row}>
              <Text style={styles.label}>Instalment Applied:</Text>
              <Text style={styles.value}>{data.instalment.label}</Text>
            </View>
          )}
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Date:</Text>
            <Text style={styles.value}>{formatDate(data.paymentDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>{data.paymentMethod.replace("_", " ")}</Text>
          </View>
          {data.transactionReference && (
            <View style={styles.row}>
              <Text style={styles.label}>Reference / UTR Number:</Text>
              <Text style={styles.value}>{data.transactionReference}</Text>
            </View>
          )}
        </View>

        {/* Amount Box */}
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Amount Paid</Text>
          <Text style={styles.amountValue}>{formatINR(data.amount.toString())}</Text>

          <View style={styles.balanceRow}>
            <Text style={styles.label}>Previous Balance Due:</Text>
            <Text style={styles.value}>{formatINR(data.previousBalance.toString())}</Text>
          </View>

          <View style={styles.row}>
            <Text style={{ ...styles.label, fontFamily: "Helvetica-Bold" }}>Remaining Balance Due:</Text>
            <Text
              style={{
                ...styles.value,
                color: parseFloat(data.remainingBalance.toString()) > 0 ? "#d97706" : "#16a34a",
              }}
            >
              {formatINR(data.remainingBalance.toString())}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated on {formatDate(new Date())} by {data.generatedBy?.name ?? "Authorized Staff"}
          </Text>
          <Text style={styles.footerText}>Radhe Vastraz Academy • Computer Generated Document</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderReceiptPDF(data: ReceiptData): Promise<Buffer> {
  const element = React.createElement(ReceiptDocument, { data });
  return renderToBuffer(element as any);
}
