from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.db.models import Avg
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Spacer, Paragraph
from django.shortcuts import get_object_or_404
from .models import StoreInformation, StoreEvaluation
from .serializers import StoreInformationSerializer, StoreEvaluationSerializer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
import io
import matplotlib
import matplotlib.pyplot as plt

# Ensure Matplotlib does not use Tkinter
matplotlib.use("Agg")


@api_view(['DELETE'])
def delete_evaluation(request, evaluation_id):
    try:
        evaluation = StoreEvaluation.objects.get(id=evaluation_id)
        evaluation.delete()
        return Response({"message": "Evaluation deleted successfully"}, status=204)
    except StoreEvaluation.DoesNotExist:
        return Response({"error": "Evaluation not found"}, status=404)


def get_performance_description(percentage):
    if percentage >= 90:
        return "Excellent"
    if percentage >= 80:
        return "Very Good"
    if percentage >= 70:
        return "Good"
    if percentage >= 60:
        return "Fair"
    if percentage >= 50:
        return "Needs Improvement"
    return "Poor"


class StoreInformationViewSet(viewsets.ModelViewSet):
    queryset = StoreInformation.objects.all()
    serializer_class = StoreInformationSerializer

    @action(detail=False, methods=["get"])
    def reports(self, request):
        stores = StoreInformation.objects.all()
        report_data = []

        for store in stores:
            evaluations = StoreEvaluation.objects.filter(store=store)

            if evaluations.exists():
                store_data = {
                    "store_id": store.id,
                    "store_name": store.name,
                    "evaluations": []
                }

                # Collect the raw evaluation data for each store
                for evaluation in evaluations:
                    store_data["evaluations"].append({
                        "id": evaluation.id,
                        "cl1": evaluation.cl1,
                        "cl2": evaluation.cl2,
                        "cl3": evaluation.cl3,
                        "cl4": evaluation.cl4,
                        "cl5": evaluation.cl5,
                        "cl6": evaluation.cl6,
                        "cl7": evaluation.cl7,
                        "cn1": evaluation.cn1,
                        "cn2": evaluation.cn2,
                        "cn3": evaluation.cn3,
                        "cn4": evaluation.cn4,
                        "cn5": evaluation.cn5,
                        "cn6": evaluation.cn6,
                        "cn7": evaluation.cn7,
                        "cn8": evaluation.cn8,
                        "cn9": evaluation.cn9,
                        "cn10": evaluation.cn10,
                        "cn11": evaluation.cn11,
                        "ce1": evaluation.ce1,
                        "ce2": evaluation.ce2,
                        "ce3": evaluation.ce3,
                        "ce4": evaluation.ce4,
                        "ce5": evaluation.ce5,
                        "ce6": evaluation.ce6,
                        "pg1": evaluation.pg1,
                        "ac1": evaluation.ac1,
                        "ac2": evaluation.ac2,
                        "ac3": evaluation.ac3,
                        "ss1": evaluation.ss1,
                        "ss2": evaluation.ss2,
                        "ss3": evaluation.ss3,
                        "pq1": evaluation.pq1,
                        "pq2": evaluation.pq2,
                        "evaluation_date": evaluation.evaluation_date,
                        "remarks": evaluation.remarks,
                    })

                report_data.append(store_data)

        return Response(report_data)


class StoreEvaluationViewSet(viewsets.ModelViewSet):
    queryset = StoreEvaluation.objects.all()
    serializer_class = StoreEvaluationSerializer


def calculate_performance(evaluation):
    rating_fields = [
        "cl1", "cl2", "cl3", "cl4", "cl5", "cl6", "cl7",
        "cn1", "cn2", "cn3", "cn4", "cn5", "cn6", "cn7", "cn8", "cn9", "cn10", "cn11",
        "ce1", "ce2", "ce3", "ce4", "ce5", "ce6",
        "pg1", "ac1", "ac2", "ac3",
        "ss1", "ss2", "ss3",
        "pq1", "pq2"
    ]

    total_score = sum(evaluation.get(field, 0) for field in rating_fields)
    total_possible_score = len(rating_fields) * 5
    performance_percentage = (total_score / total_possible_score) * 100

    return performance_percentage


def calculate_average_rating(evaluation):
    rating_fields = [
        "cl1", "cl2", "cl3", "cl4", "cl5", "cl6", "cl7",
        "cn1", "cn2", "cn3", "cn4", "cn5", "cn6", "cn7", "cn8", "cn9", "cn10", "cn11",
        "ce1", "ce2", "ce3", "ce4", "ce5", "ce6",
        "pg1", "ac1", "ac2", "ac3",
        "ss1", "ss2", "ss3",
        "pq1", "pq2"
    ]

    total_rating = sum(evaluation.get(field, 0) for field in rating_fields)
    average_rating = total_rating / len(rating_fields)

    return average_rating


import io
import math
import matplotlib.pyplot as plt
from matplotlib import colors as mcolors
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from .models import StoreInformation, StoreEvaluation

def generate_store_report(request, store_id):
    store = get_object_or_404(StoreInformation, id=store_id)
    evaluations = StoreEvaluation.objects.filter(store=store)

    total_evals = evaluations.count()
    if total_evals == 0:
        return HttpResponse("No evaluations available for this store.", status=404)

    # Category setup
    category_labels = {
        'CL': 'CLEANLINESS (CL)',
        'CN': 'CONDITION (CN)',
        'CE': 'CUSTOMER ENGAGEMENT (CE)',
        'PG': 'PERSONNEL GROOMING (PG)',
        'AC': 'ACCURACY (AC)',
        'SS': 'SPEED OF SERVICE (SS)',
        'PQ': 'PRODUCT QUALITY (PQ)',
    }

    abbreviated_labels = {
        'CL': '(CL)',
        'CN': '(CN)',
        'CE': '(CE)',
        'PG': '(PG)',
        'AC': '(AC)',
        'SS': '(SS)',
        'PQ': '(PQ)',
    }

    question_counts = {
        'CL': 7, 'CN': 11, 'CE': 6, 'PG': 1, 'AC': 3, 'SS': 3, 'PQ': 2
    }

    totals = {key: 0 for key in category_labels}

    for eval in evaluations:
        totals['CL'] += eval.cl1 + eval.cl2 + eval.cl3 + eval.cl4 + eval.cl5 + eval.cl6 + eval.cl7
        totals['CN'] += eval.cn1 + eval.cn2 + eval.cn3 + eval.cn4 + eval.cn5 + eval.cn6 + eval.cn7 + eval.cn8 + eval.cn9 + eval.cn10 + eval.cn11
        totals['CE'] += eval.ce1 + eval.ce2 + eval.ce3 + eval.ce4 + eval.ce5 + eval.ce6
        totals['PG'] += eval.pg1
        totals['AC'] += eval.ac1 + eval.ac2 + eval.ac3
        totals['SS'] += eval.ss1 + eval.ss2 + eval.ss3
        totals['PQ'] += eval.pq1 + eval.pq2

    averages = {
        key: round(totals[key] / (question_counts[key] * total_evals), 2)
        for key in category_labels
    }

    # Calculate Total Performance and Overall Average
    def calculate_performance(evaluation):
        rating_fields = [
            "cl1", "cl2", "cl3", "cl4", "cl5", "cl6", "cl7",
            "cn1", "cn2", "cn3", "cn4", "cn5", "cn6", "cn7", "cn8", "cn9", "cn10", "cn11",
            "ce1", "ce2", "ce3", "ce4", "ce5", "ce6",
            "pg1", "ac1", "ac2", "ac3",
            "ss1", "ss2", "ss3",
            "pq1", "pq2"
        ]

        total_score = sum(getattr(evaluation, field, 0) for field in rating_fields)
        total_possible_score = len(rating_fields) * 5
        performance_percentage = (total_score / total_possible_score) * 100

        return performance_percentage

    def calculate_average_rating(evaluation):
        rating_fields = [
            "cl1", "cl2", "cl3", "cl4", "cl5", "cl6", "cl7",
            "cn1", "cn2", "cn3", "cn4", "cn5", "cn6", "cn7", "cn8", "cn9", "cn10", "cn11",
            "ce1", "ce2", "ce3", "ce4", "ce5", "ce6",
            "pg1", "ac1", "ac2", "ac3",
            "ss1", "ss2", "ss3",
            "pq1", "pq2"
        ]

        total_rating = sum(getattr(evaluation, field, 0) for field in rating_fields)
        average_rating = total_rating / len(rating_fields)

        return average_rating

    def get_performance_description(percentage):
        if percentage >= 95:
            return "Outstanding"
        if percentage >= 90:
            return "Excellent"
        if percentage >= 85:
            return "Great"
        if percentage >= 80:
            return "Very Good"
        if percentage >= 75:
            return "Good"
        if percentage >= 70:
            return "Above Average"
        if percentage >= 65:
            return "Average"
        if percentage >= 60:
            return "Fair"
        if percentage >= 55:
            return "Needs Improvement"
        if percentage >= 50:
            return "Below Average"
        return "Poor"

    # Calculate the Total Performance, Overall Average, and Performance Description
    total_performance = sum(calculate_performance(eval) for eval in evaluations) / total_evals
    overall_average = sum(calculate_average_rating(eval) for eval in evaluations) / total_evals
    performance_description = get_performance_description(total_performance)

    # Retrieve all stores and their evaluations to calculate rankings
    all_stores = StoreInformation.objects.all()
    store_performance_data = []

    for s in all_stores:
        store_evaluations = StoreEvaluation.objects.filter(store=s)
        if store_evaluations.exists():
            store_total_performance = sum(calculate_performance(eval) for eval in store_evaluations) / store_evaluations.count()
            store_overall_average = sum(calculate_average_rating(eval) for eval in store_evaluations) / store_evaluations.count()
            store_most_recent_evaluation_date = max(eval.evaluation_date for eval in store_evaluations)
            store_performance_data.append((s, store_total_performance, store_overall_average, store_most_recent_evaluation_date))

    # Sort stores by Total Performance, Overall Average, and Most Recent Evaluation Date
    store_performance_data.sort(key=lambda x: (x[1], x[2], x[3]), reverse=True)

    # Determine store ranking
    store_ranking = next((index + 1 for index, data in enumerate(store_performance_data) if data[0] == store), None)

    # Generate bar graph with increased size and grid lines
    fig, ax = plt.subplots(figsize=(10, 6))  # Increased size
    categories = [abbreviated_labels[key] for key in averages.keys()]
    values = list(averages.values())
    bar_colors = [
        "#FF6384",  # rgba(255, 99, 132, 0.6)
        "#36A2EB",  # rgba(54, 162, 235, 0.6)
        "#FFCE56",  # rgba(255, 206, 86, 0.6)
        "#4BC0C0",  # rgba(75, 192, 192, 0.6)
        "#9966FF",  # rgba(153, 102, 255, 0.6)
        "#FF9F40",  # rgba(255, 159, 64, 0.6)
        "#4B4BC0"   # rgba(75, 75, 192, 0.6)
    ]
    ax.bar(categories, values, color=bar_colors)
    ax.set_xlabel('Categories')
    ax.set_ylabel('Average Rating')
    ax.set_title('Average Ratings by Category')
    ax.grid(True, which='both', linestyle='--', linewidth=0.5)  # Add grid lines

    # Save the bar plot to a BytesIO object
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)

    # Generate a single pie chart with lower opacity gray areas for improvements
    fig, ax = plt.subplots(figsize=(10, 6))
    labels = [abbreviated_labels[key] for key in averages.keys()]
    sizes = list(averages.values())
    improvement_sizes = [5 - average if 5 - average > 0 else 0 for average in sizes]  # Hide zero values
    colors = bar_colors
    pie_colors = colors + [mcolors.to_rgba(c, alpha=0.3) for c in colors]

    # Filter out zero improvement sizes
    filtered_improvement_sizes = [size for size in improvement_sizes if size > 0]
    filtered_labels = labels + [f'Missing Portion ({abbreviated_labels[key]})' for key, size in zip(averages.keys(), improvement_sizes) if size > 0]
    wedges, texts = ax.pie(sizes + filtered_improvement_sizes, labels=filtered_labels, colors=pie_colors, startangle=90, labeldistance=1.1)

    # Add the numbers inside the pie chart
    for i, wedge in enumerate(wedges):
        angle = (wedge.theta2 + wedge.theta1) / 2
        x = wedge.r * 0.7 * math.cos(math.radians(angle))
        y = wedge.r * 0.7 * math.sin(math.radians(angle))
        if i < len(sizes):
            ax.text(x, y, f'{sizes[i]:.2f}', color='black', fontsize=12, ha='center', va='center')
        else:
            ax.text(x, y, f'{filtered_improvement_sizes[i - len(sizes)]:.2f}', color='black', fontsize=12, ha='center', va='center')

    ax.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.

    # Save the pie chart to a BytesIO object
    pie_buf = io.BytesIO()
    plt.savefig(pie_buf, format='png')
    pie_buf.seek(0)

    # PDF Setup
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{store.name}_report.pdf"'
    doc = SimpleDocTemplate(response, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # Store Info
    elements.append(Paragraph(f"<b>Store Name:</b> {store.name}", styles["Title"]))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph(f"<b>Store Ranking:</b> {store_ranking}", styles["Normal"]))  # Adjust store ranking
    elements.append(Paragraph(f"<b>Address:</b> {store.address}", styles["Normal"]))
    elements.append(Paragraph(f"<b>Audit Schedule:</b> {store.audit_schedule}", styles["Normal"]))
    evaluation = StoreEvaluation.objects.filter(store=store).first()  # Assuming the first evaluation for simplicity
    if evaluation:
        elements.append(Paragraph(f"<b>Evaluation Date:</b> {evaluation.evaluation_date}", styles["Normal"]))
    elements.append(Spacer(1, 12))

    # Table Header
    elements.append(Paragraph("<b>Average Ratings by Category</b>", styles["Heading2"]))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph("<div align='center'>1 - Strongly Disagree, 2 - Disagree, 3 - Neutral, 4 - Agree, 5 - Strongly Agree</div>", styles["Normal"]))
    elements.append(Spacer(1, 6))

    # Table Data
    table_data = [["Category", "Average Rating"]]
    for key, label in category_labels.items():
        table_data.append([label, f"{averages[key]:.2f}"])

    # Table Styling
    table = Table(table_data, colWidths=[300, 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), '#d3d3d3'),
        ('TEXTCOLOR', (0, 0), (-1, 0), 'black'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONT SIZE', (0, 0), (-1, -1), 10),
        ('BOTTOM PADDING', (0, 0), (-1, 0), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, 'grey'),
        ('BACKGROUND', (0, 1), (-1, -1), '#f5f5f5'),  # Alternating row background color
    ]))

    elements.append(table)
    elements.append(Spacer(1, 12))

    # Add the Total Performance, Overall Average, and Performance Description table
    elements.append(Spacer(1, 12))
    elements.append(Paragraph("<b>Performance Summary</b>", styles["Heading2"]))
    summary_data = [
        ["Total Performance (%)", "Overall Average", "Performance Description"],
        [f"{total_performance:.2f}%", f"{overall_average:.2f}", performance_description]
    ]
    summary_table = Table(summary_data, colWidths=[150, 150, 150])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), '#d3d3d3'),
        ('TEXTCOLOR', (0, 0), (-1, 0), 'black'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONT SIZE', (0, 0), (-1, -1), 10),
        ('BOTTOM PADDING', (0, 0), (-1, 0), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, 'grey'),
        ('BACKGROUND', (0, 1), (-1, -1), '#f5f5f5'),  # Alternating row background color
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 12))

    # Add remarks at the first of the PDF
    elements.append(Spacer(1, 12))

    first_evaluation = evaluations.first()  # Get the first evaluation for remarks
    if first_evaluation and first_evaluation.remarks:
        elements.append(Spacer(1, 12))
        elements.append(Paragraph(f"<b>Remarks:</b>", styles["Normal"]))
        elements.append(Paragraph(first_evaluation.remarks, styles["Normal"]))  # Display remarks as a paragraph
    else:
        elements.append(Spacer(1, 12))
        elements.append(Paragraph(f"<b>Remarks:</b> No remarks", styles["Normal"]))

    # Add the bar graph and pie chart to the second page
    elements.append(PageBreak())
    elements.append(Image(buf, 8 * inch, 4 * inch))  # Adjusted size to match the increased figure size
    elements.append(Spacer(1, 12))
    elements.append(Paragraph("<b>Category Performance Pie Chart</b>", styles["Heading2"]))
    elements.append(Image(pie_buf, 8 * inch, 4 * inch))

    doc.build(elements)

    return response

@api_view(['GET'])
def store_report(request, store_id):
    return generate_store_report(request, store_id)